import { Types, kernel } from "../dependency-injection/";
import * as Exceptions from "../exceptions/";
import * as Services from "../services/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase, ActionContext, ErrorContext } from "./ActionBase";

export class Action extends ActionBase<Entities.IJob> {
    private jobService: Services.IJobService;
    private jobRepo: Repositories.IJobRepository;
    private userRepo: Repositories.IUserRepository;
    private boxService: Services.IBoxService;
    private boxRepo: Repositories.IBoxRepository;

    constructor() {
        super();
        this.jobService = kernel.get<Services.IJobService>(Types.JobService);
        this.jobRepo = kernel.get<Repositories.IJobRepository>(Types.JobRepository);
        this.userRepo = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
        this.boxService = kernel.get<Services.IBoxService>(Types.BoxService);
        this.boxRepo = kernel.get<Repositories.IBoxRepository>(Types.BoxRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IJob> {
        let updatedJob: Entities.IJob = context.params.job;

        // check if status is CANCELED => jobService.cancelJob
        if (!!context.params.status && context.params.status == Entities.JobStatuses.CANCELED) {
            let box: Entities.IBox = await this.boxRepo.findOne({ code: updatedJob.box });
            if (!!box) {
                await this.boxService.deactivateBox(box);

            }
            updatedJob = await this.jobService.cancelJob(updatedJob);
        }

        // check if status is COMPLETED => jobService.completeJob
        if (!!context.params.status && context.params.status == Entities.JobStatuses.COMPLETED) {
            let box: Entities.IBox = await this.boxRepo.findOne({ code: updatedJob.box });
            if (!!box) {
                await this.boxService.deactivateBox(box);
            }
            updatedJob = await this.jobService.completeJob(updatedJob);
        }

        return updatedJob;
    }

    protected getConstraints() {
        return {
            userId: "required",
            jobId: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        // check job policies
        let job = await this.jobRepo.findOne({ id: context.params.jobId });
        if (!job) {
            throw new Exceptions.EntityNotFoundException("Job", context.params.jobId);
        }
        if (job.status != Entities.JobStatuses.ACCEPTED && job.status != Entities.JobStatuses.IN_PROGRESS) {
            throw new Exceptions.ServiceLayerException("CANCEL_FAILED_INVALID_JOB_STATUS");
        }
        context.params.job = job;
        delete context.params.jobId;

        // check courier policies
        let courier: Entities.IUser = await this.userRepo.findOne({ id: context.params.userId });
        if (!courier) {
            throw new Exceptions.EntityNotFoundException("User", context.params.userId);
        }
        if (courier.type != Entities.UserType.Courier || courier.id != job.courierId) {
            throw new Exceptions.UserNotAuthorizedException(courier.username, "UpdateJob");
        }
        context.params.courier = courier;
        delete context.params.userId;

        return super.onActionExecuting(context);
    }
}
