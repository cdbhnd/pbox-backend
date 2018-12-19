export interface Sensor {
    name: string,
    code: string,
    status: string,
    value: any,   // cause some sensors may operate with diffrent values
    assetId?: string,
    assetName?: string,
    topic?: string,
    type?: string,
    timestamp?: number
}