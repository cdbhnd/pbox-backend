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
    private _boxService: Services.IBoxService;
    private _boxRepo: Repositories.BoxRepository;

    constructor() 
    {
        super();
        this._jobService = kernel.get<Services.IJobService>(Types.JobService);
        this._jobRepo = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._userRepo = kernel.get<Repositories.UserRepository>(Types.UserRepository);
        this._boxService = kernel.get<Services.IBoxService>(Types.BoxService);
        this._boxRepo = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
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
        if (job.status != Entities.JobStatuses.ACCEPTED && job.status != Entities.JobStatuses.IN_PROGRESS) 
        {
            throw new Exceptions.ServiceLayerException('CANCEL_FAILED_INVALID_JOB_STATUS');
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
        context.params.courier = courier;
        delete context.params.userId;

        return super.onActionExecuting(context);
    }

    public async execute(context: ActionContext): Promise<Entities.Job> 
    {
        let updatedJob: Entities.Job = context.params.job;

        // check if status is CANCELED => jobService.cancelJob
        if (!!context.params.status && context.params.status == Entities.JobStatuses.CANCELED) 
        {
            let box: Entities.Box = await this._boxRepo.findOne({ code: updatedJob.box });
            if (!!box) {
                await this._boxService.deactivateBox(box);

            }
            updatedJob = await this._jobService.cancelJob(updatedJob);   
        }

        // check if status is COMPLETED => jobService.completeJob
        if (!!context.params.status && context.params.status == Entities.JobStatuses.COMPLETED) 
        {
            let box: Entities.Box = await this._boxRepo.findOne({ code: updatedJob.box });
            if (!!box) {
                await this._boxService.deactivateBox(box);
            }
            updatedJob = await this._jobService.completeJob(updatedJob);
        }

        return updatedJob;
    }
}
