import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Services from "../services";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as config from "config";

export class Action extends ActionBase<boolean> {
    private boxService: Services.BoxService;
    private boxRepository: Repositories.IBoxRepository;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
        this.boxService = kernel.get<Services.BoxService>(Types.BoxService);
    };

    public async execute(context: ActionContext): Promise<boolean> {
        let box = context.params.box;
        for (let i = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].name == context.params.sensorType) {
                // update box sensor if  stored sensor value is older then 20 sec
                let timeDiff = (new Date().getTime() - box.sensors[i].timestamp);
                if (timeDiff > config.get("boxService.updateThreshold")) {
                    await this.boxRepository.updateBoxSensor(box, context.params.sensorType, context.params.newSensorValue);
                    return true;
                }
            }
        }
        return false;
    }

    protected getConstraints() {
        return {
            box: "required",
            sensorType: "required",
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
