import * as Entities from '../entities';

export interface IIotPlatform
{
    sendDataToSensor(sensor: Entities.ISensor)
    getSensorData(sensor: Entities.ISensor)
    listenBoxSensors(box: Entities.IBox, callback: Function)
    stopListenBoxSensors(box: Entities.IBox)
    getDeviceSensors(box: Entities.IBox): Promise<any>
}