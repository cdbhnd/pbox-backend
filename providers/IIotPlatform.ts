import * as Entities from '../entities';

export interface IIotPlatform
{
    sendDataToSensor(sensor: Entities.Sensor)
    getSensorData(sensor: Entities.Sensor)
    listenBoxSensors(box: Entities.Box, callback: Function)
    stopListenBoxSensors(box: Entities.Box)
}