export interface Box 
{
    id?: string,
    code: string,
    size: string,
    status: string,
    sensors: sensor[]
}

interface sensor {
    name: string,
    code: string,
    status: string,
    value: string
}