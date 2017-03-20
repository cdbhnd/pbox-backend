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

    constructor() {
        super();
        this.jobService = kernel.get<Services.IJobService>(Types.JobService);
        this.jobRepo = kernel.get<Repositories.IJobRepository>(Types.JobRepository);
        this.userRepo = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IJob> {
        let updatedJob: Entities.IJob = context.params.job;

        // check if pickup is updated => jobService.updatePickup
        if (!!context.params.pickup) {
            let pickupLocation: Entities.IGeolocation = {
                latitude: context.params.pickup.latitude,
                longitude: context.params.pickup.longitude,
                address: context.params.pickup.address,
            };
            updatedJob = await this.jobService.updatePickup(updatedJob, pickupLocation);
        }

        // check if destination is updated => jobService.updateDestination
        if (!!context.params.destination) {
            let destinationLocation: Entities.IGeolocation = {
                latitude: context.params.destination.latitude,
                longitude: context.params.destination.longitude,
                address: context.params.destination.address,
            };
            updatedJob = await this.jobService.updateDestination(updatedJob, destinationLocation);
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
        if (!job.courierId || job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("CHANGE_LOCATION_FAILED_INVALID_JOB_STATUS");
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

        return super.onActionExecuting(context);
    }
}
