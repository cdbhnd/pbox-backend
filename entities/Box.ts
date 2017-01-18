import {Sensor} from './Sensor';

export interface Box 
{
    id?: string,
    code: string,
    size: string,
    status: string,
    sensors: Sensor[],
    host?: string,
    topic?: string,
    groundId?: string,
    clientId?: string,
    clientKey?: string,
    deviceId?: string,
    deviceName?: string
}