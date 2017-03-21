import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../infrastructure/exceptions";

export class Action extends ActionBase<Entities.IBox> {
    private boxRepository: Repositories.IBoxRepository;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox> {

        let box: Entities.IBox = await this.boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", context.params.boxCode);
        }

        return box;
    }

    protected getConstraints() {
        return {
            boxCode: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }
}
