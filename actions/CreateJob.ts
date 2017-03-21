import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Services from "../services/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";

export class Action extends ActionBase<Entities.IJob> {
    private jobService: Services.IJobService;

    constructor() {
        super();
        this.jobService = kernel.get<Services.IJobService>(Types.JobService);
    };

    public async execute(context): Promise<Entities.IJob> {

        let job: Entities.IJob = {
            id: null,
            pickup: context.params.pickup,
            name: null,
            destination: {
                latitude: null,
                longitude: null,
                address: null,
            },
            size: context.params.size,
            status: null,
            createdAt: null,
            userId: context.params.userId,
            courierId: null,
            box: null,
        };

        return await this.jobService.createJob(job);
    }

    protected getConstraints() {
        return {
            "userId": "required",
            "size": "required",
            "pickup.latitude": "required",
            "pickup.longitude": "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }
}
