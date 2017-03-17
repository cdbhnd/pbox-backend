import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.IJob[]> {
    private jobRepository: Repositories.IJobRepository;
    private userRepository: Repositories.IUserRepository;

    constructor() {
        super();
        this.jobRepository = kernel.get<Repositories.IJobRepository>(Types.JobRepository);
        this.userRepository = kernel.get<Repositories.IUserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.IJob[]> {
        let userJobs: Entities.IJob[];
        let userFromDb = context.params.userFromDb;

        // courier user  can use generic query
        if (userFromDb.type == Entities.UserType.Courier) {
            userJobs = await this.jobRepository.find(context.query);
        } else {
            userJobs = await this.jobRepository.find({ userId: context.params.id });
        }

        return userJobs;
    }

    protected getConstraints() {
        return {
            id: "required",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        let userFromDb = await this.userRepository.findOne({ id: context.params.id });

        if (!userFromDb) {
            throw new Exceptions.EntityNotFoundException("User", "");
        }
        context.params.userFromDb = userFromDb;
        return context;
    }
}
