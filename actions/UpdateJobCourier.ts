import { Types, kernel } from "../dependency-injection/";
import * as Exceptions from "../exceptions/";
import * as Services from '../services/';
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase, ActionContext, ErrorContext } from './ActionBase';

export class Action extends ActionBase<Entities.Job> 
{
    private _jobService: Services.IJobService;
    private _jobRepo: Repositories.JobRepository;
    private _userRepo: Repositories.UserRepository;

    constructor() 
    {
        super();
        this._jobService = kernel.get<Services.IJobService>(Types.JobService);
        this._jobRepo = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._userRepo = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    protected getConstraints() 
    {
        return {
            'userId': 'required',
            'jobId': 'required'
        };
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext>
    {
        // check job policies
        let job = await this._jobRepo.findOne({ id: context.params.jobId });
        if (!job) 
        {
            throw new Exceptions.EntityNotFoundException('Job', context.params.jobId);
        }
        if (job.status != Entities.JobStatuses.ACCEPTED || job.status != Entities.JobStatuses.PENDING) 
        {
            throw new Exceptions.ServiceLayerException('CHNAGE_COURIER_FAILED_INVALID_JOB_STATUS');
        }
        context.params.job = job;
        delete context.params.jobId;

        // check courier policies
        let courier: Entities.User = await this._userRepo.findOne({ id: context.params.userId });
        if (!courier)
        {
            throw new Exceptions.EntityNotFoundException('User', context.params.userId);
        }
        if (courier.type != Entities.UserType.Courier || courier.id != job.courierId) 
        {
            throw new Exceptions.UserNotAuthorizedException(courier.username, 'UpdateJob');
        }

        return super.onActionExecuting(context);
    }

    public async execute(context: ActionContext): Promise<Entities.Job> 
    {
        let updatedJob: Entities.Job = context.params.job;

        // check if courierId is updated => jobService.assignCourier
        if (!!context.params.courierId) 
        {
            let courier: Entities.User = await this._userRepo.findOne({ id: context.params.courierId });

            updatedJob = await this._jobService.assignCourier(updatedJob, courier);
        }

        // check if courierId is removed => jobService.unassignCourier
        if (context.params.courierId == '') 
        {
            updatedJob = await this._jobService.unassignCourier(updatedJob);
        }

        return updatedJob;
    }
}
