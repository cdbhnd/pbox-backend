export interface Sensor {
    name: string,
    code: string,
    status: string,
    value: string,
    assetId?: string,
    assetName?: string,
    topic?: string
}