export interface Job {
    id?: number,
    userId?: string,
    pickup: geolocation,
    size: packageSize,
    status: string,
    timeStamp: string
}

interface geolocation {
    latitude: number,
    longitude: number
}

export type packageSize  = 'S' | 'M' | 'L' | 'XL';
