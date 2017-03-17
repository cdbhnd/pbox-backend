import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from "../repositories/";
import * as Entities from "../entities/";
import { ActionBase } from "./ActionBase";
import { ActionContext } from "./ActionBase";
import * as Exceptions from "../exceptions";

export class Action extends ActionBase<Entities.Job[]> {
    private jobRepository: Repositories.JobRepository;
    private userRepository: Repositories.UserRepository;

    constructor() {
        super();
        this.jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this.userRepository = kernel.get<Repositories.UserRepository>(Types.UserRepository);
    };

    public async execute(context: ActionContext): Promise<Entities.Job[]> {
        let userJobs: Entities.Job[];
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
