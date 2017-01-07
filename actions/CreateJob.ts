import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Services from '../services/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';
var moment = require('moment-timezone');

export class Action extends ActionBase<Entities.Job> 
{
    private _jobService: Services.IJobService;

    constructor() 
    {
        super();
        this._jobService = kernel.get<Services.IJobService>(Types.JobService);
    };

    protected getConstraints() 
    {
        return {
            'userId': 'required',
            'size': 'required',  //TODO write rules for size
            'pickup.latitude': 'required', //TODOwrite rule for number
            'pickup.longitude': 'required' //TODO write rule for number
        };
    }

    protected getSanitizationPattern() 
    {
        return {};
    }

    public async execute(context): Promise<Entities.Job> 
    {

        let job: Entities.Job = {
            id: null,
            pickup: context.params.pickup,
            name: null,
            destination: {
                latitude: null,
                longitude: null,
                address: null
            },
            size: context.params.size,
            status: null,
            createdAt: null,
            userId: context.params.userId,
            courierId: null,
            box: null
        };

        return await this._jobService.createJob(job);
    }
}
