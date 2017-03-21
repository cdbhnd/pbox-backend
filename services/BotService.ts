import { IBotService } from "./IBotService";
import { IBot, IBox } from "../entities/";
import { Types, kernel } from "../infrastructure/dependency-injection/";
import { injectable } from "inversify";
import { IBotProvider } from "../providers/";
import { IBoxRepository } from "../repositories/";
import { Check } from "../utility/Check";
import * as Exceptions from "../infrastructure/exceptions/";

@injectable()
export class BotService implements IBotService {
    private boxRepo: IBoxRepository;

    constructor() {
        this.boxRepo = kernel.get<IBoxRepository>(Types.BoxRepository);
    }

    public async activate(bot: IBot): Promise<IBot> {
        Check.notNull(bot, "bot");

        let box: IBox = await this.boxRepo.findOne({ code: bot.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", bot.boxCode);
        }

        for (let i = 0; i < bot.services.length; i++) {
            let provider: IBotProvider = kernel.getNamed<IBotProvider>(Types.BotProvider, bot.services[i].provider);
            await provider.unsubscribe(bot);
            await provider.subscribe(bot);
        }

        return bot;
    }

    public async deactivate(bot: IBot): Promise<IBot> {
        Check.notNull(bot, "bot");

        let box: IBox = await this.boxRepo.findOne({ code: bot.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", bot.boxCode);
        }

        for (let i = 0; i < bot.services.length; i++) {
            let provider: IBotProvider = kernel.getNamed<IBotProvider>(Types.BotProvider, bot.services[i].provider);
            await provider.unsubscribe(bot);
        }

        return bot;
    }
}
