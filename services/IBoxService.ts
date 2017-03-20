import * as Entities from "../entities/";

export interface IBoxService {
    addSensor(box: Entities.IBox, sensor: Entities.ISensor): Promise<Entities.IBox>;
    removeSensor(box: Entities.IBox, sensorCode: string): Promise<Entities.IBox>;
    activateBox(box: Entities.IBox): Promise<Entities.IBox>;
    deactivateBox(box: Entities.IBox): Promise<Entities.IBox>;
    sleepBox(box: Entities.IBox): Promise<Entities.IBox>;
    listenBoxSensors(box: Entities.IBox): Promise<Entities.IBox>;
    stopListenBoxSensors(box: Entities.IBox): Promise<Entities.IBox>;
    setBoxSensors(box: Entities.IBox): Promise<Entities.IBox>;
}
