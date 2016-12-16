export interface Job {
    id?: number,
    userId?: string,
    pickup: geolocation,
    size: packageSize,
    status: string,
    createdAt: string
}

interface geolocation {
    latitude: number,
    longitude: number
}

export type packageSize  = 'S' | 'M' | 'L' | 'XL';
