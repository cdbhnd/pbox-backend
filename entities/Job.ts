export interface Job {
    id?: number,
    userId: string,
    pickup: geolocation,
    destination?: geolocation,
    size: packageSize,
    status: string,
    createdAt: string,
    receiverName?: string,
    receiverPhone?: string,
    courierId?: string,
    box?: string
}

interface geolocation {
    latitude: number,
    longitude: number
}

export type packageSize  = 'S' | 'M' | 'L' | 'XL';
