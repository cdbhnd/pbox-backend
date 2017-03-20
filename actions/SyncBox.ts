import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import * as Services from "../services";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.IBox> {
    private boxRepository: Repositories.IBoxRepository;
    private userRepository: Repositories.IUserRepository;
    private boxService: Services.IBoxService;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
        this.boxService = kernel.get<Services.IBoxService>(Types.BoxService);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox> {

        let box: Entities.IBox = await this.boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", context.params.boxCode);
        }

        box = await this.boxService.setBoxSensors(box);
        box = await this.boxRepository.update(box);
        return box;
    }

    protected getConstraints() {
        return {
            userId: "required",
            boxCode: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        let userFromDb = await this.userRepository.findOne({ id: context.params.userId });

        if (!userFromDb || userFromDb.type != Entities.UserType.Admin) {
            throw new Exceptions.EntityNotFoundException("User", context.params.userId);
        }
        return context;
    }
}
