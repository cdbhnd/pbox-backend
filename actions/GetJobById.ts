import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.Job> {
    private jobRepository: Repositories.JobRepository;
    private userRepository: Repositories.UserRepository;

    constructor() {
        super();
        this.jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this.userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.Job> {
        let user = context.params.user;
        let job: Entities.Job = await this.jobRepository.findOne({ id: context.params.jobId });

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
        let user: Entities.User = await this.userRepository.findOne({ id: context.params.userId });
        if (!user) {
            throw new Exceptions.EntityNotFoundException("User", "");
        }
        context.params.user = user;
        return context;
    }
}
