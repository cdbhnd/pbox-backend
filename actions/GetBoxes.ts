import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.Box[]> {
    private boxRepository: Repositories.BoxRepository;
    private userRepository: Repositories.UserRepository;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this.userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.Box[]> {
        let boxes = await this.boxRepository.find(context.query);
        return boxes;
    }

    protected getConstraints() {
        return {
            id: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        let userFromDb = await this.userRepository.findOne({ id: context.params.id });

        if (!userFromDb || (userFromDb.type != Entities.UserType.Courier && userFromDb.type != Entities.UserType.Admin)) {
            throw new Exceptions.EntityNotFoundException("User", "");
        }
        return context;
    }
}
