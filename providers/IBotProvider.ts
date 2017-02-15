import { Bot, Box } from '../entities/';

export interface IBotProvider 
{
    subscribe(serviceData: any, box: Box): Promise<boolean>;
    unsubscribe(serviceData: any, box: Box): Promise<boolean>;
}