import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";
import { IBotService } from "../services/";
import { IIotPlatform } from "../providers/";

export class Action extends ActionBase<Entities.IBot[]> {
    private boxRepository: Repositories.IBoxRepository;
    private botRepository: Repositories.IBotRepository;
    private botService: IBotService;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.botRepository = kernel.get<Repositories.IBotRepository>(Types.BotRepository);
        this.botService = kernel.get<IBotService>(Types.BotService);
    };

    public async execute(context: ActionContext): Promise<Entities.IBot[]> {

        let bots: Entities.IBot[] = await this.botRepository.findAll();

        for (let i = 0; i < bots.length; i++) {
            await this.botService.activate(bots[i]);
        }

        return bots;
    }

    protected getConstraints() {
        return {};
    }

    protected getSanitizationPattern() {
        return {};
    }
}
