import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';

export class Action extends ActionBase<Entities.Box> 
{
    private _boxRepository: Repositories.BoxRepository;

    constructor() 
    {
        super();
        this._boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
    };

    protected getConstraints() 
    {
        return {
            'boxCode': 'required'
        };
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    public async execute(context: ActionContext): Promise<Entities.Box> {

        var box: Entities.Box = await this._boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException('Box', context.params.boxCode);
        }

        return box;
    }
}
