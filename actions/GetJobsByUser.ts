import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';

export class Action extends ActionBase<Entities.Job[]> 
{
    private _jobRepository: Repositories.JobRepository;
    private _userRepository: Repositories.UserRepository;

    constructor() 
    {
        super();
        this._jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
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

    public async execute(context): Promise<Entities.Job[]> 
    {
        let userFromDb = await this._userRepository.find({ _id: context.params.id });
        if (!userFromDb) {
            throw new Exceptions.EntityNotFoundException('User', '');
        }
        let userJobs = await this._jobRepository.find({ userId: context.params.id });
        return userJobs;
    }
}
