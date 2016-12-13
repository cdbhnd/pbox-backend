import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';

export class Action extends ActionBase<Entities.Job> {
    _jobsRepository: Repositories.JobsRepository;

    constructor() {
        super();
        this._jobsRepository = kernel.get<Repositories.JobsRepository>(Types.JobsRepository);
    };

    protected getConstraints() {
        return {
            'size': 'required',
            'pickup.latitude': 'required|integer',
            'pickup.longitude': 'required|integer'
        };
    }

    protected async execute(context): Promise<Entities.Job> {

        let job: Entities.Job = {
            pickup: context.params.pickup,
            size: context.params.size,
            status: 'PENDING'
        }

        let createdJob = await this._jobsRepository.create(job);

        return createdJob;
    }
}
