import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../infrastructure/exceptions";

export class Action extends ActionBase<Entities.IBox[]> {
    private boxRepository: Repositories.IBoxRepository;
    private userRepository: Repositories.IUserRepository;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox[]> {
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
