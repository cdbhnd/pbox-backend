import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Services from '../services';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';
import * as config from 'config';

export class Action extends ActionBase<Entities.Box>
{
    private _boxRepository: Repositories.BoxRepository;
    private _userRepository: Repositories.UserRepository;
    private _boxService: Services.BoxService;

    constructor() {
        super();
        this._boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
        this._boxService = kernel.get<Services.BoxService>(Types.BoxService);
    };

    protected getConstraints() {
        return {
            'userId': 'required',
            'code': 'required',  //TODO write rules for size
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

        let box: Entities.Box = await this._boxRepository.findOne({ code: context.params.code });

        if (!!box) {
            throw new Exceptions.ValidationException('Box with ' + context.params.code + ' code already exists');
        }

        return context;
    }

    public async execute(context: ActionContext): Promise<Entities.Box> {

        let box: Entities.Box = {
            id: null,
            code: context.params.code,
            size: !!context.params.size ? context.params.size : null,
            status: Entities.BoxStatuses.IDLE,
            sensors: null,
            deviceId: context.params.deviceId,
            topic: String(config.get('iot_platform.topic')),
            clientId: String(config.get('iot_platform.att_clientId')),
            clientKey: String(config.get('iot_platform.att_clientKey'))
        };

        if (!!context.params.deviceId) {
           box = await this._boxService.setBoxSensors(box);
        }

        box = await this._boxRepository.create(box);

        return box;
    }
}
