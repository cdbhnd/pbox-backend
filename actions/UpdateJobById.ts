import { Types, kernel } from "../dependency-injection/";
import { ValidationException } from "../exceptions/";
import * as Services from '../services/';
import * as Entities from '../entities/';
import { ActionBase } from './ActionBase';
import { ActionContext } from './ActionBase';

export class Action extends ActionBase<Entities.Job> {
    _jobService: Services.IJobService;

    constructor() {
        super();
        this._jobService = kernel.get<Services.IJobService>(Types.JobService);
    };

    protected getConstraints() {
        return {
            'userId': 'required',
            'jobId': 'required'
        };
    }

    protected async execute(context): Promise<Entities.Job> 
    {
        // check if job exists

        // check if user exists

        // check if user is authorized to acces the Job

        // check if status is CANCELED => jobService.cancelJob

        // check if status is COMPLETED => jobService.completeJob

        // check if pickup is updated => jobService.updatePickup

        // check if destination is updated => jobService.updateDestination

        // check if receiverName is updated AND/OR receiverPhone is updated => jobService.updateReceiver 

        // check if courierId is updated => jobService.assignCourier 

        // check if courierId is removed => jobService.unassignCourier

        // check if size is updated => jobService.updateSize

        // check if box is updated => jobService.attachBox

        return null;
    }
}
