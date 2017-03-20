import { IBot, IBox } from "../entities/";

export interface IBotProvider {
    subscribe(bot: IBot): Promise<boolean>;
    unsubscribe(bot: IBot): Promise<boolean>;
    update(token: string, data: any): Promise<boolean>;
    informUsers(bot: IBot, message: string): void;
}
