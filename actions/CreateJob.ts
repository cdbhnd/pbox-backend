import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Repositories from '../repositories/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
var moment = require('moment-timezone');

export class Action extends ActionBase<Entities.Job> {
    _jobRepository: Repositories.JobRepository;

    constructor() {
        super();
        this._jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
    };

    protected getConstraints() {
        return {
            'userId': 'required',
            'size': 'required',  //TODO write rules for size
            'pickup.latitude': 'required', //TODOwrite rule for number
            'pickup.longitude': 'required' //TODO write rule for number
        };
    }

    protected async execute(context): Promise<Entities.Job> {

        let job: Entities.Job = {
            id: null,
            pickup: context.params.pickup,
            destination: {
                latitude: null,
                longitude: null,
                address: null
            },
            size: context.params.size,
            status: 'PENDING',
            createdAt: moment().format(),
            userId: context.params.userId,
            courierId: null,
            box: null
        }

        let createdJob = await this._jobRepository.create(job);

        return createdJob;
    }
}
