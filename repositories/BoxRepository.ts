import * as Entities from '../entities'

export interface BoxRepository {
    create(box: Entities.Box): Promise<Entities.Box>
    find(query: any): Promise<Entities.Box[]>
    findOne(query: any): Promise<Entities.Box>
    findAll(): Promise<Entities.Box[]>
    update(box: Entities.Box): Promise<Entities.Box>
    delete(entity: Entities.Box): Promise<Boolean>
    logSensorState(box: Entities.Box, sensor: Entities.Sensor): Promise<boolean>
    updateBoxSensor(box: Entities.Box, sensor: Entities.SensorTypes, value: any): Promise<Entities.Box>
}