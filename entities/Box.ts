import { ISensor } from "./Sensor";

export interface IBox {
    id?: string;
    code: string;
    size?: string;
    status: string;
    sensors?: ISensor[];
    host?: string;
    topic?: string;
    groundId?: string;
    clientId?: string;
    clientKey?: string;
    deviceId?: string;
    deviceName?: string;
}
