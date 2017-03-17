import { Bot } from "../entities/";

export interface IBotService {
    activate(bot: Bot);
    deactivate(bot: Bot);
}
