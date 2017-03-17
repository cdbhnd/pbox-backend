import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";
import { IBoxService } from "../services/";
import { IIotPlatform } from "../providers/";

export class Action extends ActionBase<Entities.IBox[]> {
    private boxRepository: Repositories.BoxRepository;
    private boxService: IBoxService;
    private iotPlatform: IIotPlatform;

    constructor() {
        super();
        this.boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this.boxService = kernel.get<IBoxService>(Types.BoxService);
        this.iotPlatform = kernel.get<IIotPlatform>(Types.IotPlatform);
    };

    public async execute(context: ActionContext): Promise<Entities.IBox[]> {

        let activeBoxes: Entities.IBox[] = await this.boxRepository.find({ status: { $in: [Entities.BoxStatuses.ACTIVE, Entities.BoxStatuses.SLEEP] } });

        if (!activeBoxes) {
            return [];
        }

        let result: Entities.IBox[] = [];

        for (let i = 0; i < activeBoxes.length; i++) {
            this.iotPlatform.stopListenBoxSensors(activeBoxes[i]);
            let box: Entities.IBox = await this.boxService.listenBoxSensors(activeBoxes[i]);
            if (!!box) {
                result.push(box);
                console.log("Listening " + box.code);
            }
        }

        return result;
    }

    protected getConstraints() {
        return {};
    }

    protected getSanitizationPattern() {
        return {};
    }
}
