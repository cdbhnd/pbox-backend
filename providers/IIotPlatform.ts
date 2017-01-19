import * as Entities from '../entities';

export interface IIotPlatform
{
    sendDataToSensor(sensor: Entities.Sensor): Promise<any>
    getSensorData(sensor: Entities.Sensor): Promise<any>
}