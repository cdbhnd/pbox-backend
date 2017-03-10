import * as Entities from '../entities/';
import { IBoxService } from './IBoxService';
import { Box, Sensor, BoxStatuses, SensorTypes } from '../entities/';
import { Types, kernel } from "../dependency-injection/";
import { injectable } from 'inversify';
import { BoxRepository } from '../repositories/';
import * as Repositories from '../repositories/';
import { IIotPlatform } from '../providers/';
import * as Entitties from '../entities';
import * as Exceptions from '../exceptions/';
import { Check } from '../utility/Check';
import * as config from 'config';
import { IBotProvider } from '../providers/';

@injectable()
export class BoxService implements IBoxService {

    private boxRepo: BoxRepository;
    private iotPlatform: IIotPlatform;
    private _botRepository: Repositories.BotRepository;
    constructor() {
        this.boxRepo = kernel.get<BoxRepository>(Types.BoxRepository);
        this.iotPlatform = kernel.get<IIotPlatform>(Types.IotPlatform);
        this._botRepository = kernel.get<Repositories.BotRepository>(Types.BotRepository);
    }

    public async setBoxSensors(box: Box): Promise<Box> {
        let sensorData = JSON.parse(await this.iotPlatform.getDeviceSensors(box));
        this.mapSensorDataToBox(box, sensorData);
        return box;
    }

    public async addSensor(box: Box, sensor: Sensor): Promise<Box> {

        Check.notNull(box, 'Box');
        Check.notNull(sensor, 'Sensor');

        box.sensors = box.sensors ? box.sensors : [];

        for (var i = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].code == sensor.code) {
                throw new Exceptions.ValidationException('Sensor with ' + sensor.code + ' code already exists');
            }
        }

        box.sensors.push(sensor);

        box = await this.boxRepo.update(box);

        return box;
    }

    public async removeSensor(box: Box, sensorCode: string): Promise<Box> {

        Check.notNull(box, 'Box');
        Check.notNull(sensorCode, 'SensorCode');

        box.sensors = box.sensors ? box.sensors : [];

        let index: number = -1;

        for (var i = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].code == sensorCode) {
                index = i;
                break;
            }
        }

        // If index is no longer -1 box contains required sensor
        if (index != -1) {
            box.sensors.splice(index, 1);
            box = await this.boxRepo.update(box);
        }
        return box;
    }

    public async activateBox(box: Box): Promise<Box> {

        //find starter sensor 
        let starterSensor: Sensor = box.sensors.find(function (element) {
            if (element.type == SensorTypes.activator) {
                return true;
            }
        });


        for (var i = 0; i < box.sensors.length; i++) {
            box.sensors[i].status = BoxStatuses.ACTIVE;
        }

        // set starter sensor value to true and send it to iot platform
        if (!!starterSensor) {
            starterSensor.value = true;
            await this.iotPlatform.sendDataToSensor(starterSensor);
        }

        // set box status to active
        box.status = BoxStatuses.ACTIVE;

        box = await this.boxRepo.update(box);

        return box;
    }

    public async deactivateBox(box: Box): Promise<Box> {

        //find starter sensor 
        let starterSensor: Sensor = box.sensors.find(function (element) {
            if (element.type == SensorTypes.activator) {
                return true;
            }
        });

        // set starter sensor value to true and send it to iot platform
        if (!!starterSensor) {
            starterSensor.value = false;
            await this.iotPlatform.sendDataToSensor(starterSensor);
        }

        // set box status to idle
        box.status = BoxStatuses.IDLE;
        for (let i = 0; i < box.sensors.length; i++) {
            box.sensors[i].status = BoxStatuses.IDLE;
        }

        box = await this.boxRepo.update(box);

        return box;
    }
    //CHECK SENSOR STATUS IF CORECT TODO
    public async sleepBox(box: Box): Promise<Box> {

        //find starter sensor 
        let starterSensor: Sensor = box.sensors.find(function (element) {
            if (element.type == SensorTypes.activator) {
                return true;
            }
        });

        // set starter sensor value to true and send it to iot platform
        if (!!starterSensor) {
            starterSensor.value = false;
            await this.iotPlatform.sendDataToSensor(starterSensor);
        }

        // set box status to sleep
        box.status = BoxStatuses.SLEEP;

        box = await this.boxRepo.update(box);

        return box;
    }

    public async listenBoxSensors(box: Box): Promise<Box> {

        Check.notNull(box, 'box');

        if (!!box.topic && !!box.clientId && !!box.clientKey && !!box.deviceId) {


            let bot: Entities.Bot = await this._botRepository.findOne({ boxCode: box.code });

            this.iotPlatform.listenBoxSensors(box, async function (boxCode: string, sensorCode: string, sensorType: string, value: any) {
                let boxRepo: BoxRepository = kernel.get<BoxRepository>(Types.BoxRepository);
                let freshBox: Box = await boxRepo.findOne({ code: boxCode });
                if (!!freshBox && freshBox.status != BoxStatuses.IDLE) {
                    for (var i = 0; i < freshBox.sensors.length; i++) {
                        if (freshBox.sensors[i].code == sensorCode) {
                            let s: Sensor = freshBox.sensors[i];

                            s.value = value;
                            if (s.type == SensorTypes.activator) {
                                freshBox.status = s.value ? BoxStatuses.ACTIVE : BoxStatuses.SLEEP;
                            }
                            if (s.type == SensorTypes.vibration) {
                                if (s.value === '1') {
                                    for (let i = 0; i < bot.services.length; i++) {
                                        let provider: IBotProvider = kernel.getNamed<IBotProvider>(Types.BotProvider, bot.services[i].provider);
                                        provider.informUsers(bot, 'Strong vibration has occured !!!');
                                    }
                                }
                            }
                            boxRepo.logSensorState(freshBox, s);

                            break;
                        }
                    }
                    boxRepo.updateBoxSensor(freshBox, sensorType, value);
                }
            });

            return box;
        }
        return null;
    }

    public async stopListenBoxSensors(box: Box): Promise<Box> {

        Check.notNull(box, 'box');

        for (var i = 0; i < box.sensors.length; i++) {
            box.sensors[i].status = BoxStatuses.IDLE;
        }

        this.iotPlatform.stopListenBoxSensors(box);

        box = await this.boxRepo.update(box);

        return box;
    }

    private mapSensorDataToBox(box: Box, sensorData: any): void {
        box.sensors = [];
        for (var i = 0; i < sensorData.assets.length; i++) {
            let sensor: Entitties.Sensor = {
                name: sensorData.assets[i].title,
                code: sensorData.assets[i].name,
                status: 'IDLE',
                value: null,
                assetId: sensorData.assets[i].id,
                topic: '/exchange/root/client.' + String(config.get('iot_platform.att_clientId')) + '.in.asset.' + sensorData.assets[i].id + '.state',
                type: sensorData.assets[i].title
            }
            box.sensors.push(sensor);
        }
    }
}