import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Repositories from "../repositories/";
import * as Services from "../services";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../infrastructure/exceptions";
import * as config from "config";

export class Action extends ActionBase<Entities.IBox> {
    private boxRepository: Repositories.IBoxRepository;
    private userRepository: Repositories.IUserRepository;
    private boxService: Services.BoxService;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
        this.boxService = kernel.get<Services.BoxService>(Types.BoxService);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox> {

        let box: Entities.IBox = {
            id: null,
            code: context.params.code,
            size: !!context.params.size ? context.params.size : null,
            status: Entities.BoxStatuses.IDLE,
            sensors: null,
            deviceId: context.params.deviceId,
            topic: String(config.get("iot_platform.topic")),
            clientId: String(config.get("iot_platform.att_clientId")),
            clientKey: String(config.get("iot_platform.att_clientKey")),
        };

        if (!!context.params.deviceId) {
            box = await this.boxService.setBoxSensors(box);
        }

        box = await this.boxRepository.create(box);

        return box;
    }

    protected getConstraints() {
        return {
            userId: "required",
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

        let box: Entities.IBox = await this.boxRepository.findOne({ code: context.params.code });

        if (!!box) {
            throw new Exceptions.ValidationException("Box with " + context.params.code + " code already exists");
        }

        return context;
    }
}
