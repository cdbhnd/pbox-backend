import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
import * as Exceptions from '../exceptions';

export class Action extends ActionBase<Entities.Job>
{
    private _jobRepository: Repositories.JobRepository;
    private _userRepository: Repositories.UserRepository;

    constructor() {
        super();
        this._jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    protected getConstraints() {
        return {
            'userId': 'required',
            'jobId': 'required'
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        let user: Entities.User = await this._userRepository.findOne({ id: context.params.userId });
        if (!user) {
            throw new Exceptions.EntityNotFoundException('User', '');
        }
        context.params.user = user
        return context;
    }
    public async execute(context: ActionContext): Promise<Entities.Job> {
        let user = context.params.user;
        var job: Entities.Job = await this._jobRepository.findOne({ id: context.params.jobId });

        if (user.type != Entities.UserType.Courier && job.userId != user.id) {
            throw new Exceptions.UserNotAuthorizedException(user.username, 'Get job by Id');
        }
        return job;
    }
}
