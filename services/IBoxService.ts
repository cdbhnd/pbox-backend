import * as Entities from '../entities/';

export interface IBoxService {
    addSensor(box: Entities.Box, sensor: Entities.Sensor): Promise<Entities.Box>
    removeSensor(box: Entities.Box, sensorCode: string): Promise<Entities.Box>
    activateBox(box: Entities.Box): Promise<Entities.Box>
    deactivateBox(box: Entities.Box): Promise<Entities.Box>
    sleepBox(box: Entities.Box): Promise<Entities.Box>
    listenBoxSensors(box: Entities.Box): Promise<Entities.Box>
    stopListenBoxSensors(box: Entities.Box): Promise<Entities.Box>
    setBoxSensors(box: Entities.Box): Promise<Entities.Box>
}