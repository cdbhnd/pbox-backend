import { Types, kernel } from "../dependency-injection/";
import * as Exceptions from "../exceptions/";
import * as Services from '../services/';
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import * as UpdateJobStatus from './UpdateJobStatus';
import * as UpdateJobLocations from './UpdateJobLocations';
import * as UpdateJobCourier from './UpdateJobCourier';
import { ActionBase, ActionContext, ErrorContext } from './ActionBase';

export class Action extends ActionBase<Entities.Job> 
{
    private _jobService: Services.IJobService;
    private _jobRepo: Repositories.JobRepository;
    private _userRepo: Repositories.UserRepository;
    private _boxRepo: Repositories.BoxRepository;

    constructor() 
    {
        super();
        this._jobService = kernel.get<Services.IJobService>(Types.JobService);
        this._jobRepo = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._userRepo = kernel.get<Repositories.UserRepository>(Types.UserRepository);
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
        // check job policy
        let job = await this._jobRepo.findOne({ id: context.params.jobId });
        if (!job) 
        {
            throw new Exceptions.EntityNotFoundException('Job', context.params.jobId);
        }
        if (!job.courierId || job.status != Entities.JobStatuses.ACCEPTED) 
        {
            throw new Exceptions.ServiceLayerException('ATTACH_BOX_FAILED_INVALID_JOB_STATUS');
        }
        context.params.job = job;
        delete context.params.jobId;

        // check user policy
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

        // check if box is updated => jobService.attachBox
        if (!!context.params.box) 
        {
            let box = await this._boxRepo.findOne({code: context.params.box });
            if(!!box) {
                let updatedJob = await this._jobService.attachBox(context.params.job, box);
                return updatedJob;
            } else {
                throw new Exceptions.EntityNotFoundException('Box', 'Box does not exist');
            }
        }
        return updatedJob;
    }
}
