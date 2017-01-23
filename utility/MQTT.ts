import { MQTTClient } from './MQTTClient';

export class MQTT {
    private mqtt: any;
    private baseMQTTUrl: string;
    private basePort: string;

    constructor(host: string, port: string)  {

        this.mqtt = require('mqtt');
        this.baseMQTTUrl = host;
        this.basePort = port;
    }

    public createClient(deviceId: string, clientId: string, clientKey: string, topic: string): MQTTClient {

        let mqttId: string = deviceId.length > 23 ? deviceId.substring(0, 23) : deviceId;

        let brokerId: string = clientId + ':' + clientId;

        let mqttClient = this.mqtt.createClient(this.basePort, this.baseMQTTUrl, {
                clientId: mqttId,
                username: brokerId,
                password: clientKey
            })
            .subscribe(topic);

        return new MQTTClient(mqttClient);
    }
}


