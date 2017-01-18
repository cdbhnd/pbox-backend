import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';

export class Action extends ActionBase<Entities.Box[]> 
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
            'id': 'required'
        };
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    public async execute(context: ActionContext): Promise<Entities.Box[]> {

        let userFromDb = await this._userRepository.findOne({ id: context.params.id });

        if (!userFromDb || userFromDb.type != Entities.UserType.Courier) {
            throw new Exceptions.EntityNotFoundException('User', '');
        }

        let boxes = await this._boxRepository.find(context.query);
        return boxes;
    }
}
