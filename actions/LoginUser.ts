import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import { InvalidCredentialsException } from "../infrastructure/exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { validate } from "../utility/Validator";
import * as Password from "../utility/Password";
import { ActionBase } from "./ActionBase";

export class Action extends ActionBase<Entities.IUser> {
    private userRepository: Repositories.IUserRepository;

    constructor() {
        super();
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context): Promise<Entities.IUser> {
        let userFromDb = await this.userRepository.findOne({ username: context.params.username });

        if (userFromDb == null) {
            throw new InvalidCredentialsException(context.params.username, context.params.password);
        }

        let submitedPasswordValid = await Password.comparePassword(context.params.password, userFromDb.password);

        if (submitedPasswordValid && context.params.type == userFromDb.type) {
            return userFromDb;
        } else {
            // throw error
            throw new InvalidCredentialsException(context.params.username, context.params.password);
        }
    }

    protected getConstraints() {
        return {
            username: "required",
            password: "required",
            type: "required",
        };
    }

    protected getSanitizationPattern() {
        return {
            type: "to_int",
        };
    }
}
