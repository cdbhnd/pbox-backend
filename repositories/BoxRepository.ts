import * as Entities from "../entities";

export interface IBoxRepository {
    create(box: Entities.IBox): Promise<Entities.IBox>;
    find(query: any): Promise<Entities.IBox[]>;
    findOne(query: any): Promise<Entities.IBox>;
    findAll(): Promise<Entities.IBox[]>;
    update(box: Entities.IBox): Promise<Entities.IBox>;
    delete(entity: Entities.IBox): Promise<Boolean>;
    logSensorState(box: Entities.IBox, sensor: Entities.ISensor): Promise<boolean>;
    updateBoxSensor(box: Entities.IBox, sensor: Entities.SensorTypes, value: any): Promise<Entities.IBox>;
}
