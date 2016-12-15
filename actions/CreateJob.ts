import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
var moment = require('moment-timezone');

export class Action extends ActionBase<Entities.Job> {
    _jobsRepository: Repositories.JobsRepository;

    constructor() {
        super();
        this._jobsRepository = kernel.get<Repositories.JobsRepository>(Types.JobsRepository);
    };

    protected getConstraints() {
        return {
            'size': 'required',  //TODO write rules for size
            'pickup.latitude': 'required', //TODOwrite rule for number
            'pickup.longitude': 'required' //TODO write rule for number
        };
    }

    protected async execute(context): Promise<Entities.Job> {

        let job: Entities.Job = {
            pickup: context.params.pickup,
            size: context.params.size,
            status: 'PENDING',
            timeStamp: moment().format()
        }

        let createdJob = await this._jobsRepository.create(job);

        return createdJob;
    }
}
