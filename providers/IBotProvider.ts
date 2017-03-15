import { Bot, Box } from '../entities/';

export interface IBotProvider 
{
    subscribe(bot: Bot): Promise<boolean>;
    unsubscribe(bot: Bot): Promise<boolean>;
    update(token: string, data: any): Promise<boolean>
    informUsers(bot: Bot, message: string): void
}