import {Geolocation as gl} from './Geolocation';

export interface Job {
    id: number,
    userId: string,
    name?: string,
    description?: string,
    pickup: gl,
    destination: gl,
    size: packageSize,
    status: string,
    createdAt: string,
    receiverName?: string,
    receiverPhone?: string,
    courierId?: string,
    box?: string
}

export type packageSize  = 'S' | 'M' | 'L' | 'XL';
