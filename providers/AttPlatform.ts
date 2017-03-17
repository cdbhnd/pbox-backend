import * as Entities from '../entities/';
import { IIotPlatform } from './IIotPlatform';
import * as config from 'config';
import { injectable } from 'inversify';
import { Check } from '../utility/Check';
import * as request from 'request-promise';
import { MQTT } from '../utility/MQTT';
import { MQTTClient } from '../utility/MQTTClient';

@injectable()
export class AttPlatform implements IIotPlatform {
    private baseUrl: string = String(config.get('iot_platform.att_host'));
    private apiProtocol: string = String(config.get('iot_platform.att_api_protocol'));
    private mqttPort: string = String(config.get('iot_platform.att_mqtt_port'));
    private options: any = {
        headers: {
            'Auth-ClientId': config.get('iot_platform.att_clientId'),
            'Auth-ClientKey': config.get('iot_platform.att_clientKey'),
            'Content-Type': 'application/json; charset=utf-8'
        }
    };
    private enableSubscription: boolean = Boolean(config.get('iot_platform.enable_subscription'));
    private listeners: any = {};

    public async getSensorData(sensor: Entities.ISensor) {
        try {
            let url = this.apiProtocol + '://' + this.baseUrl + '/asset/' + + sensor.assetId + '/state';
            await request.get(url, this.options);
        } catch (e) {
            console.error(e);
        }
    }

    public async sendDataToSensor(sensor: Entities.ISensor) {
        try {
            let url = this.apiProtocol + '://' + this.baseUrl + '/asset/' + sensor.assetId + '/command';
            this.options.body = JSON.stringify({
                value: sensor.value
            });
            await request.put(url, this.options);
        } catch (e) {
            console.error(e);
        }
    }

    public async getDeviceSensors(box: Entities.IBox): Promise<any> {
        try {
            let url = this.apiProtocol + '://' + this.baseUrl + '/device/' + box.deviceId;
            return  await request.get(url, this.options);
        } catch (e) {
            console.error(e);
        }
    }

    public async listenBoxSensors(box: Entities.IBox, callback: Function) {
        if (!this.enableSubscription) {
            return;
        }

        if (!!this.listeners[box.id]) {
            return;
        }

        try {
            let topic: string = 'client/' + box.clientId + '/in/device/' + box.deviceId + '/asset/+/state';
            console.log(this.baseUrl);
            console.log(this.mqttPort);
            console.log(topic);
            let mqttGateway: MQTT = new MQTT(this.baseUrl, this.mqttPort);
            let mqttClient: MQTTClient = mqttGateway.createClient(box.deviceId, box.clientId, box.clientKey, topic);

            mqttClient.message(function (topic: string, message: string) {
                console.log(message);
                let data: any = JSON.parse(message);
                let result: any;
                let sensorCode: string;
                let sensorType: string;
                for (var i = 0; i < box.sensors.length; i++) {
                    if (box.sensors[i].assetId == data.Id) {
                        sensorCode = box.sensors[i].code;
                        sensorType = box.sensors[i].name;
                        console.log(data.Value);
                        let splitedValue: string[] = data.Value.split ? data.Value.split(',') : [];
                        switch (box.sensors[i].type) {
                            case Entities.SensorTypes.gps:
                                result = {
                                    latitude: splitedValue[0],
                                    longitude: splitedValue[1]
                                };
                                break;
                            case Entities.SensorTypes.temperature:
                                result = {
                                    temperature: splitedValue[0],
                                    humidity: splitedValue[1]
                                };
                                break;
                            case Entities.SensorTypes.accelerometer:
                                result = {
                                    ax: splitedValue[0],
                                    ay: splitedValue[1],
                                    az: splitedValue[2]
                                };
                                break;
                            default:
                                result = data.Value;
                                break;
                        }
                        break;
                    }
                }
                callback(box.code, sensorCode, sensorType,  result);
            });

            this.listeners[box.id] = mqttClient;
        } catch (e) {
            console.error(e);
        }
    }

    public stopListenBoxSensors(box: Entities.IBox) {
        try {
            if (!!this.listeners[box.id]) {
                let client = this.listeners[box.id] as MQTTClient;
                client.close();
                delete this.listeners[box.id];
            }
        } catch (e) {
            console.error(e);
        }
    }
}