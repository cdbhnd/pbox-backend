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

    constructor() {
        super();
        this._boxRepository = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
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

    public async execute(context: ActionContext): Promise<Entities.Box> {

        let userFromDb = await this._userRepository.findOne({ id: context.params.userId });

        if (!userFromDb || userFromDb.type != Entities.UserType.Courier) {
            throw new Exceptions.EntityNotFoundException('User', context.params.userId);
        }

        let box: Entities.Box = await this._boxRepository.findOne({ code: context.params.boxCode });

        if (!box) {
            throw new Exceptions.EntityNotFoundException('Box', context.params.boxCode);
        }

        box.sensors = box.sensors ? box.sensors : [];

        for (var i = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].code == context.params.code) {
                throw new Exceptions.ValidationException('Sensor with ' + context.params.code + ' code already exists');
            }
        }

        box.sensors.push({
            name: context.params.name,
            code: context.params.code,
            status: Entities.BoxStatuses.IDLE,
            value: null,
            assetId: context.params.assetId,
            assetName: context.params.assetName,
            topic: context.params.topic
        });

        box = await this._boxRepository.update(box);

        return box;
    }
}
