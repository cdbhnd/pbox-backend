import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Services from "../services";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as config from "config";

export class Action extends ActionBase<boolean> {
    private boxService: Services.BoxService;

    constructor() {
        super();
        this.boxService = kernel.get<Services.BoxService>(Types.BoxService);
    };

    public async execute(context: ActionContext): Promise<boolean> {
        let activatorSensor = context.params.newSensorValue;
        if (activatorSensor == false) {
            await this.boxService.deactivateBox(context.params.box);
            return true;
        }
        return false;
    }

    protected getConstraints() {
        return {
            box: "required",
            newSensorValue: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        return context;
    }
}
