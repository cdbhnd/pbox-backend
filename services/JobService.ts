import { Types, kernel } from "../dependency-injection/";
import {IJobService} from './IJobService';
import * as Entities from '../entities/';
import * as Repositories from '../repositories/';
import {Check} from '../utility/Check';
import * as Exceptions from '../exceptions/';
import { injectable } from 'inversify';

@injectable()
export class JobService implements IJobService 
{
    private  _jobRepository: Repositories.JobRepository;
    private _moment: any;

    constructor() {
        this._jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._moment = require('moment-timezone');
    }

    public async createJob(job: Entities.Job): Promise<Entities.Job> 
    {
        Check.notNull(job, 'job');

        job.status = Entities.JobStatuses.PENDING;
        job.createdAt =  this._moment().format();

        return await this._jobRepository.create(job);
    }

    public async cancelJob(job: Entities.Job): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');

        if (job.status != Entities.JobStatuses.ACCEPTED && job.status != Entities.JobStatuses.IN_PROGRESS) 
        {
            throw new Exceptions.ServiceLayerException('CANCEL_JOB_FAILED_INVALID_STATUS');            
        }

        job.status = Entities.JobStatuses.CANCELED;

        return await this._jobRepository.update(job);
    }

    public async completeJob(job: Entities.Job): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');

        if (job.status != Entities.JobStatuses.IN_PROGRESS) 
        {
            throw new Exceptions.ServiceLayerException('COMPLETE_JOB_FAILED_INVALID_STATUS');            
        }

        job.status = Entities.JobStatuses.COMPLETED;

        return await this._jobRepository.update(job);
    }

    public async updatePickup(job: Entities.Job, pickup: Entities.Geolocation): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');
        Check.notNull(pickup, 'pickup');

        if (job.status != Entities.JobStatuses.ACCEPTED) 
        {
            throw new Exceptions.ServiceLayerException('PICKUP_UPDATE_FAILED_INVALID_STATUS');            
        }

        if(!job.pickup) 
        {
            job.pickup = {
                latitude: null,
                longitude: null,
                address: null
            };
        }
        job.pickup.latitude = pickup.latitude ? pickup.latitude : job.pickup.latitude; 
        job.pickup.longitude = pickup.longitude ? pickup.longitude : job.pickup.longitude; 
        job.pickup.address = pickup.address ? pickup.address : job.pickup.address; 

        return await this._jobRepository.update(job);
    }

    public async updateDestination(job: Entities.Job, destination: Entities.Geolocation): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');
        Check.notNull(destination, 'destination');

        if (job.status != Entities.JobStatuses.ACCEPTED) 
        {
            throw new Exceptions.ServiceLayerException('DESTINATION_UPDATE_FAILED_INVALID_STATUS');            
        }

        if(!job.destination) 
        {
            job.destination = {
                latitude: null,
                longitude: null,
                address: null
            };
        }
        job.destination.latitude = destination.latitude ? destination.latitude : job.destination.latitude; 
        job.destination.longitude = destination.longitude ? destination.longitude : job.destination.longitude; 
        job.destination.address = destination.address ? destination.address : job.destination.address; 

        return await this._jobRepository.update(job);
    }

    public async updateReceiver(job: Entities.Job, receiverName: string, receiverPhone: string): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');

        job.receiverName = receiverName ? receiverName : job.receiverName;
        job.receiverPhone = receiverPhone ? receiverPhone : job.receiverPhone;

        return await this._jobRepository.update(job);
    }

    public async assignCourier(job: Entities.Job, courier: Entities.User): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');
        Check.notNull(courier, 'courier');

        if (job.status != Entities.JobStatuses.PENDING) 
        {
            throw new Exceptions.ServiceLayerException('COURIER_ASSIGN_FAILED_INVALID_STATUS');            
        }

        if (!!job.courierId) 
        {
            throw new Exceptions.ServiceLayerException('COURIER_ASSIGN_FAILED_ALREADY_ASSIGNED');
        }

        job.courierId = courier.id;
        job.status = Entities.JobStatuses.ACCEPTED;

        return await this._jobRepository.update(job);
    }

    public async unassignCourier(job: Entities.Job): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');

        if (job.status != Entities.JobStatuses.ACCEPTED) 
        {
            throw new Exceptions.ServiceLayerException('COURIER_UNASSIGN_FAILED_INVALID_STATUS');            
        }

        job.courierId = '';
        job.status = Entities.JobStatuses.PENDING;

        return await this._jobRepository.update(job);
    }

    public async updateSize(job: Entities.Job, size: Entities.packageSize): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');
        Check.notNull(size, 'size');

        if (job.status != Entities.JobStatuses.ACCEPTED) 
        {
            throw new Exceptions.ServiceLayerException('SIZE_UPDATE_FAILED_INVALID_STATUS');            
        }

        job.size = size;

        return await this._jobRepository.update(job);
    }

    public async attachBox(job: Entities.Job, box: Entities.Box): Promise<Entities.Job>
    {
        Check.notNull(job, 'job');
        Check.notNull(box, 'box');

        if (job.status != Entities.JobStatuses.ACCEPTED) 
        {
            throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_INVALID_STATUS');            
        }

        if (!!job.box) 
        {
            throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_ALREADY_ATTACHED');            
        }

        job.box = box.code;
        job.status = Entities.JobStatuses.IN_PROGRESS;

        return await this._jobRepository.update(job);
    }
}