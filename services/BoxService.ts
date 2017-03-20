import * as Entities from "../entities/";
import { IBoxService } from "./IBoxService";
import { IBox, ISensor, BoxStatuses, SensorTypes, SensorStatuses } from "../entities/";
import { Types, kernel } from "../dependency-injection/";
import { injectable } from "inversify";
import { IBoxRepository } from "../repositories/";
import * as Repositories from "../repositories/";
import { IIotPlatform } from "../providers/";
import * as Entitties from "../entities";
import * as Exceptions from "../exceptions/";
import { Check } from "../utility/Check";
import * as config from "config";
import { IBotProvider } from "../providers/";

@injectable()
export class BoxService implements IBoxService {

    private boxRepo: IBoxRepository;
    private iotPlatform: IIotPlatform;
    private botRepository: Repositories.IBotRepository;
    constructor() {
        this.boxRepo = kernel.get<IBoxRepository>(Types.BoxRepository);
        this.iotPlatform = kernel.get<IIotPlatform>(Types.IotPlatform);
        this.botRepository = kernel.get<Repositories.IBotRepository>(Types.BotRepository);
    }

    public async setBoxSensors(box: IBox): Promise<IBox> {
        let sensorData = JSON.parse(await this.iotPlatform.getDeviceSensors(box));
        this.mapSensorDataToBox(box, sensorData);
        return box;
    }

    public async addSensor(box: IBox, sensor: ISensor): Promise<IBox> {

        Check.notNull(box, "Box");
        Check.notNull(sensor, "Sensor");

        box.sensors = box.sensors ? box.sensors : [];

        for (let i = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].code == sensor.code) {
                throw new Exceptions.ValidationException("Sensor with " + sensor.code + " code already exists");
            }
        }

        box.sensors.push(sensor);

        box = await this.boxRepo.update(box);

        return box;
    }

    public async removeSensor(box: IBox, sensorCode: string): Promise<IBox> {

        Check.notNull(box, "Box");
        Check.notNull(sensorCode, "SensorCode");

        box.sensors = box.sensors ? box.sensors : [];

        let index: number = -1;

        for (let i = 0; i < box.sensors.length; i++) {
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

    public async activateBox(box: IBox): Promise<IBox> {

        this.setStatusToBoxSensors(box, SensorStatuses.ACTIVE);

        let starterSensor = this.checkIfActivatorExist(box);

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

    public async deactivateBox(box: IBox): Promise<IBox> {
        box.status = BoxStatuses.IDLE;

        this.setStatusToBoxSensors(box, SensorStatuses.IDLE);

        box = await this.boxRepo.update(box);

        let starterSensor = this.checkIfActivatorExist(box);

        // set starter sensor value to true and send it to iot platform
        if (!!starterSensor) {
            starterSensor.value = false;
            await this.iotPlatform.sendDataToSensor(starterSensor);
        }

        return box;
    }
    // CHECK SENSOR STATUS IF CORECT TODO
    public async sleepBox(box: IBox): Promise<IBox> {

        // find starter sensor
        let starterSensor: ISensor = box.sensors.find((element) => {
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

    public async listenBoxSensors(box: IBox): Promise<IBox> {

        Check.notNull(box, "box");

        if (!!box.topic && !!box.clientId && !!box.clientKey && !!box.deviceId) {

            let bot: Entities.IBot = await this.botRepository.findOne({ boxCode: box.code });
            let boxService = this;
            this.iotPlatform.listenBoxSensors(box, async (boxCode: string, sensorCode: string, sensorType: string, newSensorValue: any) => {
                let boxRepo: IBoxRepository = kernel.get<IBoxRepository>(Types.BoxRepository);
                let freshBox: IBox = await boxRepo.findOne({ code: boxCode });
                if (!!freshBox && freshBox.status != BoxStatuses.IDLE) {
                    for (let i = 0; i < freshBox.sensors.length; i++) {
                        if (freshBox.sensors[i].name == sensorType) {

                            let selectedBoxSensor: ISensor = freshBox.sensors[i];
                            let oldSensorValue = selectedBoxSensor.value;
                            selectedBoxSensor.value = newSensorValue;

                            if (selectedBoxSensor.type == SensorTypes.activator) {
                                // if activator is set to false deactivate box
                                if (!selectedBoxSensor.value) {
                                    boxService.deactivateBox(freshBox);
                                }
                            }

                            if (selectedBoxSensor.type == SensorTypes.vibration) {
                                if (selectedBoxSensor.value === "1") {
                                    for (let x = 0; x < bot.services.length; x++) {
                                        let provider: IBotProvider = kernel.getNamed<IBotProvider>(Types.BotProvider, bot.services[x].provider);
                                        provider.informUsers(bot, "Strong vibration has occured !!!");
                                    }
                                }
                            }

                            // update if its new value and if its sensor value older then 20 sec
                            if (JSON.stringify(oldSensorValue) != JSON.stringify(newSensorValue)) {
                                let timeDiff = (new Date().getTime() - selectedBoxSensor.timestamp);
                                if (timeDiff > config.get("boxService.updateThreshold")) {
                                    boxRepo.updateBoxSensor(freshBox, sensorType, newSensorValue);
                                }
                            }

                            boxRepo.logSensorState(freshBox, selectedBoxSensor);
                            break;
                        }
                    }
                }
            });

            return box;
        }
        return null;
    }

    public async stopListenBoxSensors(box: IBox): Promise<IBox> {

        Check.notNull(box, "box");

        for (let i = 0; i < box.sensors.length; i++) {
            box.sensors[i].status = BoxStatuses.IDLE;
        }

        this.iotPlatform.stopListenBoxSensors(box);

        box = await this.boxRepo.update(box);

        return box;
    }

    private mapSensorDataToBox(box: IBox, sensorData: any): void {
        box.sensors = [];
        let timestamp = new Date().getTime();

        for (let i = 0; i < sensorData.assets.length; i++) {
            let sensor: Entitties.ISensor = {
                name: sensorData.assets[i].title,
                code: sensorData.assets[i].name,
                status: "IDLE",
                value: null,
                assetId: sensorData.assets[i].id,
                topic: "/exchange/root/client." + String(config.get("iot_platform.att_clientId")) + ".in.asset." + sensorData.assets[i].id + ".state",
                type: sensorData.assets[i].title,
                timestamp: timestamp,
            };
            box.sensors.push(sensor);
        }
    }

    private setStatusToBoxSensors(box: IBox, status: string): IBox {
        for (let i = 0; i < box.sensors.length; i++) {
            box.sensors[i].status = status;
        }
        return box;
    }

    private checkIfActivatorExist(box: IBox): ISensor {
        return box.sensors.find((element) => {
            if (element.type == SensorTypes.activator) {
                return true;
            }
        });
    }
}
