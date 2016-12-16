import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';

var moment = require('moment-timezone');

export class Action extends ActionBase<Entities.Job[]> {
    _jobRepository: Repositories.JobRepository;
    _userRepository: Repositories.UserRepository

    constructor() {
        super();
        this._jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    protected getConstraints() {
        return {
            'id': 'required',
        };
    }

    protected async execute(context): Promise<Entities.Job[]> {
        
        let userFromDb = await this._userRepository.findUserById(context.params.id);
        
        if(!userFromDb) {
            throw new Exceptions.EntityNotFoundException('User', '');
        }

        let userJobs = await this._jobRepository.findByUser(context.params.id);

        return userJobs;
    }
}
