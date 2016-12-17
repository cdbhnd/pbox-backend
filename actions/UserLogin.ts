import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import { InvalidCredentialsException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { validate } from '../utility/validator';
import * as Password from '../utility/Password';
import { ActionBase } from './ActionBase';

export class Action extends ActionBase<Entities.User> {
    _userRepository: Repositories.UserRepository;

    constructor() {
        super();
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    protected getConstraints() {
        return {
            'username': 'required',
            'password': 'required',
        };
    }

    protected async execute(context): Promise<Entities.User> {
        let userFromDb = await this._userRepository.find({ username: context.params.username });

        if (userFromDb == null) {
            throw new InvalidCredentialsException(context.params.username, context.params.password);
        }

        let submitedPasswordValid = await Password.comparePassword(context.params.password, userFromDb[0].password);

        if (submitedPasswordValid) {
            return userFromDb[0];
        } else {
            // throw error 
            throw new InvalidCredentialsException(context.params.username, context.params.password);
        }
    }
}
