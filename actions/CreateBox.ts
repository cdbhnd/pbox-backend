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
    private _userRepository: Repositories.UserRepository;

    constructor() 
    {
        super();
        this._boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    protected getConstraints() 
    {
        return {
            'userId': 'required',
            'code': 'required',  //TODO write rules for size
            'size': 'required'
        };
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    public async execute(context: ActionContext): Promise<Entities.Box> {

        let userFromDb = await this._userRepository.findOne({ id: context.params.userId });

        if (!userFromDb || (userFromDb.type != Entities.UserType.Courier && userFromDb.type != Entities.UserType.Admin)) {
            throw new Exceptions.EntityNotFoundException('User', context.params.userId);
        }

        let box: Entities.Box = await this._boxRepository.findOne({ code: context.params.code });

        if (!!box) {
            throw new Exceptions.ValidationException('Box with ' + context.params.code + ' code already exists');
        }

        box = {
            id: null,
            code: context.params.code,
            size: context.params.size,
            status: Entities.BoxStatuses.IDLE,
            sensors: null,
            host: context.params.host,
            topic: context.params.topic,
            groundId: context.params.groundId,
            clientId: context.params.clientId,
            clientKey: context.params.clientKey,
            deviceId: context.params.deviceId,
            deviceName: context.params.deviceName
        };

        box = await this._boxRepository.create(box);

        return box;
    }
}
