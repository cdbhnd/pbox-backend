import { Types, kernel } from "../infrastructure/dependency-injection/";
import { ValidationException } from "../infrastructure/exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../infrastructure/exceptions";

export class Action extends ActionBase<Entities.IJob> {
    private jobRepository: Repositories.IJobRepository;
    private userRepository: Repositories.IUserRepository;

    constructor() {
        super();
        this.jobRepository = kernel.get<Repositories.IJobRepository>(Types.JobRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IJob> {
        let user = context.params.user;
        let job: Entities.IJob = await this.jobRepository.findOne({ id: context.params.jobId });

        if (user.type != Entities.UserType.Courier && job.userId != user.id) {
            throw new Exceptions.UserNotAuthorizedException(user.username, "Get job by Id");
        }
        return job;
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
        let user: Entities.IUser = await this.userRepository.findOne({ id: context.params.userId });
        if (!user) {
            throw new Exceptions.EntityNotFoundException("User", "");
        }
        context.params.user = user;
        return context;
    }
}
