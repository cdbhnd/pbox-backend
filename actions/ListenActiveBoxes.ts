import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';
import { IBoxService } from '../services/';

export class Action extends ActionBase<Entities.Box[]> 
{
    private _boxRepository: Repositories.BoxRepository;
    private _boxService: IBoxService;

    constructor() 
    {
        super();
        this._boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this._boxService = kernel.get<IBoxService>(Types.BoxService);
    };

    protected getConstraints() 
    {
        return {}
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    public async execute(context: ActionContext): Promise<Entities.Box[]> {

        let activeBoxes: Entities.Box[] = await this._boxRepository.find({ status: Entities.BoxStatuses.ACTIVE });

        if (!activeBoxes) {
            return [];
        }

        let result: Entities.Box[] = [];

        for (var i = 0;i < activeBoxes.length; i++) {
            let box: Entities.Box = await this._boxService.listenBoxSensors(activeBoxes[i]);
            if (!!box) {
                result.push(box);
            }
        }

        return result;
    }
}
