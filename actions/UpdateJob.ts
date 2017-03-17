import { Types, kernel } from "../dependency-injection/";
import * as Exceptions from "../exceptions/";
import * as Services from "../services/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { UpdateJobStatus, UpdateJobLocations, UpdateJobCourier, AssignJobBox } from "./index";
import { ActionBase, ActionContext, ErrorContext } from "./ActionBase";

export class Action extends ActionBase<Entities.Job> {
    private jobService: Services.IJobService;
    private jobRepo: Repositories.JobRepository;
    private userRepo: Repositories.UserRepository;

    constructor() {
        super();
        this.jobService = kernel.get<Services.IJobService>(Types.JobService);
        this.jobRepo = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this.userRepo = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.Job> {
        let updatedJob: Entities.Job = context.params.job;

        // check if receiverName is updated AND/OR receiverPhone is updated => jobService.updateReceiver
        if (!!context.params.receiverName || !!context.params.receiverPhone) {
            updatedJob = await this.jobService.updateReceiver(updatedJob, context.params.receiverName, context.params.receiverPhone);
        }

        // check if size is updated => jobService.updateSize
        if (!!context.params.size) {
            let pckSize: string = context.params.size.toString().toUpperCase();

            updatedJob = await this.jobService.updateSize(updatedJob, pckSize);
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
        // check if job exists
        let job = await this.jobRepo.findOne({ id: context.params.jobId });
        if (!job) {
            throw new Exceptions.EntityNotFoundException("Job", context.params.jobId);
        }
        context.params.job = job;
        delete context.params.jobId;

        // check if user exists
        let courier: Entities.User = await this.userRepo.findOne({ id: context.params.userId });
        if (!courier) {
            throw new Exceptions.EntityNotFoundException("User", context.params.userId);
        }

        // check if user is courier
        if (courier.type != Entities.UserType.Courier) {
            throw new Exceptions.UserNotAuthorizedException(courier.username, "UpdateJob");
        }

        // check if user is authorized to acces the Job
        if (!!job.courierId && courier.id != job.courierId) {
            throw new Exceptions.UserNotAuthorizedException(courier.username, "UpdateJob");
        }
        context.params.courier = courier;
        delete context.params.userId;

        return super.onActionExecuting(context);
    }

    protected async onError(errorContext: ErrorContext<Entities.Job>): Promise<ErrorContext<Entities.Job>> {
        if (!!errorContext.context.params && !!errorContext.context.params.job) {
            errorContext.result = await this.jobRepo.update(errorContext.context.params.job);
        }
        return super.onError(errorContext);
    }

    protected subActions(): Array<ActionBase<Entities.Job>> {
        return new Array<ActionBase<Entities.Job>>(
            new UpdateJobStatus.Action(),
            new UpdateJobLocations.Action(),
            new UpdateJobCourier.Action(),
            new AssignJobBox.Action());
    }
}
