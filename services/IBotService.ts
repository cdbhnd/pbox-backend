import { IBot } from "../entities/";

export interface IBotService {
    activate(bot: IBot);
    deactivate(bot: IBot);
}
