import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.IBox> {
    private boxRepository: Repositories.IBoxRepository;
    private userRepository: Repositories.IUserRepository;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox> {

        let box: Entities.IBox = await this.boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", context.params.boxCode);
        }

        box.size = context.params.size ? context.params.size : box.size;
        box.host = context.params.host ? context.params.host : box.host;
        box.topic = context.params.topic ? context.params.topic : box.topic;
        box.groundId = context.params.groundId ? context.params.groundId : box.groundId;
        box.clientId = context.params.clientId ? context.params.clientId : box.clientId;
        box.clientKey = context.params.clientKey ? context.params.clientKey : box.clientKey;
        box.deviceId = context.params.deviceId ? context.params.deviceId : box.deviceId;
        box.deviceName = context.params.deviceName ? context.params.deviceName : box.deviceName;

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

        if (!userFromDb || (userFromDb.type != Entities.UserType.Courier && userFromDb.type != Entities.UserType.Admin)) {
            throw new Exceptions.EntityNotFoundException("User", context.params.userId);
        }
        return context;
    }
}
