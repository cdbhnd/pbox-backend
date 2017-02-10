import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { IBoxService } from '../services/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';

export class Action extends ActionBase<Entities.Box>
{
    private _boxRepository: Repositories.BoxRepository;
    private _userRepository: Repositories.UserRepository;
    private _boxService: IBoxService; 

    constructor() {
        super();
        this._boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
        this._boxService = kernel.get<IBoxService>(Types.BoxService);
    };

    protected getConstraints() {
        return {
            'userId': 'required',
            'boxCode': 'required',
            'name': 'required',
            'code': 'required'
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        
        let userFromDb = await this._userRepository.findOne({ id: context.params.userId });

        if (!userFromDb || (userFromDb.type != Entities.UserType.Courier && userFromDb.type != Entities.UserType.Admin)) {
            throw new Exceptions.EntityNotFoundException('User', context.params.userId);
        }

        let box: Entities.Box = await this._boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException('Box', context.params.boxCode);
        }

        context.params.box = box;
        delete context.params.userId;
        delete context.params.boxCode;

        return context;
    }

    public async execute(context: ActionContext): Promise<Entities.Box> {

        let sensor: Entities.Sensor = {
            name: context.params.name,
            code: context.params.code,
            status: Entities.BoxStatuses.IDLE,
            value: null,
            assetId: context.params.assetId,
            assetName: context.params.assetName,
            topic: context.params.topic
        };

        return await this._boxService.addSensor(context.params.box, sensor);
    }
}
