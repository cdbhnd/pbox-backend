import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../infrastructure/exceptions";
import * as config from "config";
import {EventAggregator} from "../infrastructure/eventEngine/EventAggregator";

export class Action extends ActionBase<boolean> {
    private userRepository: Repositories.IUserRepository;
    constructor() {
        super();
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<boolean> {
        let eventMediator = EventAggregator.getMediator();
        eventMediator.boradcastEvent(context.params.eventName, context.params.data);
        return true;
    }

    protected getConstraints() {
        return {
            eventName: "required",
            data: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        return context;
    }
}
