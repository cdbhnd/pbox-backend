import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.IBox> {
    private boxRepository: Repositories.BoxRepository;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
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
