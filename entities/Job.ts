import {IGeolocation as gl} from "./Geolocation";

export interface IJob {
    id: number;
    userId: string;
    name?: string;
    description?: string;
    pickup: gl;
    destination: gl;
    size: packageSize;
    status: string;
    createdAt: string;
    receiverName?: string;
    receiverPhone?: string;
    courierId?: string;
    box?: string;
}

export type packageSize  = "S" | "M" | "L" | "XL";
