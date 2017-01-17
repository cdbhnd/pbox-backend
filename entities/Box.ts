export interface Box 
{
    id?: string,
    code: string,
    size: string,
    status: string,
    sensors: sensor[],
    host?: string,
    topic?: string,
    groundId?: string,
    clientId?: string,
    clientKey?: string,
    deviceId?: string,
    deviceName?: string
}

interface sensor {
    name: string,
    code: string,
    status: string,
    value: string,
    assetId?: string,
    assetName?: string,
    topic?: string
}