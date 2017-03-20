import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { IBoxService } from "../services/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.IBox> {
    private boxRepository: Repositories.IBoxRepository;
    private userRepository: Repositories.IUserRepository;
    private boxService: IBoxService;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
        this.boxService = kernel.get<IBoxService>(Types.BoxService);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox> {

        let sensor: Entities.ISensor = {
            name: context.params.name,
            code: context.params.code,
            status: Entities.BoxStatuses.IDLE,
            value: null,
            assetId: context.params.assetId,
            assetName: context.params.assetName,
            topic: context.params.topic,
        };

        return await this.boxService.addSensor(context.params.box, sensor);
    }

    protected getConstraints() {
        return {
            userId: "required",
            boxCode: "required",
            name: "required",
            code: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {

        let userFromDb = await this.userRepository.findOne({ id: context.params.userId });

        if (!userFromDb || (userFromDb.type != Entities.UserType.Courier && userFromDb.type != Entities.UserType.Admin)) {
            throw new Exceptions.EntityNotFoundException("User", context.params.userId);
        }

        let box: Entities.IBox = await this.boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", context.params.boxCode);
        }

        context.params.box = box;
        delete context.params.userId;
        delete context.params.boxCode;

        return context;
    }
}
