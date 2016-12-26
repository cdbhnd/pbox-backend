import { Types, kernel } from "../dependency-injection/";
import * as Exceptions from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import { generateHash } from '../utility/Password';

export class Action extends ActionBase<Entities.User> 
{
    private _userRepository: Repositories.UserRepository;

    constructor() 
    {
        super();
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    }

    protected getConstraints() 
    {
        return {
            'username': 'required',
            'password': 'required',
            'type': 'required'
        };
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    protected async execute(context): Promise<Entities.User> 
    {
        let existingUser = await this._userRepository.findOne({ username: context.params.username });

        if (!!existingUser) {
            throw new Exceptions.UsernameNotAvailableException(context.params.username);
        }

        let user: Entities.User = {
            firstName: context.params.first_name,
            lastName: context.params.last_name,
            username: context.params.username,
            password: await generateHash(context.params.password),
            type: context.params.type
        };

        let createdUser = await this._userRepository.create(user);

        return createdUser;
    }
}