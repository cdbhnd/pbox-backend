import { Types, kernel } from "../dependency-injection/";
import * as Exceptions from "../exceptions/";
import * as Services from "../services/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import * as UpdateJobStatus from "./UpdateJobStatus";
import * as UpdateJobLocations from "./UpdateJobLocations";
import * as UpdateJobCourier from "./UpdateJobCourier";
import { ActionBase, ActionContext, ErrorContext } from "./ActionBase";

export class Action extends ActionBase<Entities.Job> {
    private jobService: Services.IJobService;
    private jobRepo: Repositories.JobRepository;
    private userRepo: Repositories.UserRepository;
    private boxRepo: Repositories.BoxRepository;
    private boxService: Services.IBoxService;

    constructor() {
        super();
        this.jobService = kernel.get<Services.IJobService>(Types.JobService);
        this.jobRepo = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this.userRepo = kernel.get<Repositories.UserRepository>(Types.UserRepository);
        this.boxRepo = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this.boxService = kernel.get<Services.IBoxService>(Types.BoxService);
    };

    public async execute(context: ActionContext): Promise<Entities.Job> {

        if (!context.params.box) {
            return context.params.job;
        }

        let box = await this.boxRepo.findOne({ code: context.params.box });
        if (!box) {
            throw new Exceptions.EntityNotFoundException("Box", "Box does not exist");
        }

        /** First attach box to the Job  */
        let updatedJob = await this.jobService.attachBox(context.params.job, box);

        /** Second activate box and start listen to the sensors */
        await this.boxService.activateBox(box);

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
        // check job policy
        let job = await this.jobRepo.findOne({ id: context.params.jobId });
        if (!job) {
            throw new Exceptions.EntityNotFoundException("Job", context.params.jobId);
        }
        if (!job.courierId || job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("ATTACH_BOX_FAILED_INVALID_JOB_STATUS");
        }
        context.params.job = job;
        delete context.params.jobId;

        // check user policy
        let courier: Entities.User = await this.userRepo.findOne({ id: context.params.userId });
        if (!courier) {
            throw new Exceptions.EntityNotFoundException("User", context.params.userId);
        }
        if (courier.type != Entities.UserType.Courier || courier.id != job.courierId) {
            throw new Exceptions.UserNotAuthorizedException(courier.username, "UpdateJob");
        }
        return super.onActionExecuting(context);
    }
}
