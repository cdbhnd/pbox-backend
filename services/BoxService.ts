import { IBoxService } from './IBoxService';
import { Box, Sensor, BoxStatuses, SensorTypes } from '../entities/';
import { Types, kernel } from "../dependency-injection/";
import { injectable } from 'inversify';
import { BoxRepository } from '../repositories/';
import { IIotPlatform } from '../providers/';
import * as Exceptions from '../exceptions/';
import { Check } from '../utility/Check';

@injectable()
export class BoxService implements IBoxService {

    private boxRepo: BoxRepository;
    private iotPlatform: IIotPlatform;

    constructor() {
        this.boxRepo = kernel.get<BoxRepository>(Types.BoxRepository);
        this.iotPlatform = kernel.get<IIotPlatform>(Types.IotPlatform);
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

        // set starter sensor value to true and send it to iot platform
        if (!!starterSensor) {
            starterSensor.value = true;
            await this.iotPlatform.sendDataToSensor(starterSensor);
        }

        // set box status to active
        box.status = BoxStatuses.ACTIVE;

        return await this.boxRepo.update(box);
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

        // set box status to active
        box.status = BoxStatuses.ACTIVE;

        return await this.boxRepo.update(box);
    }

    public listenBoxSensors(box: Box) {

        if (!!box.host && !!box.topic && !!box.clientId && !!box.clientKey && !!box.deviceId) {

            this.iotPlatform.listenBoxSensors(box, function (sensorCode: string, value: any) {
                let boxRepo: BoxRepository = kernel.get<BoxRepository>(Types.BoxRepository);
                for (var i = 0; i < box.sensors.length; i++) {
                    if (box.sensors[i].code == sensorCode) {
                        box.sensors[i].value = value;
                        console.log('Box with ' + box.code + ' just update ' + box.sensors[i].type + ' sensor');
                        console.log(value);
                        break;
                    }
                }
                boxRepo.update(box);
            });
        }
    }
}