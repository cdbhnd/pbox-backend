import { Types, kernel } from "../dependency-injection/";
import { IJobService } from './IJobService';
import * as Entities from '../entities/';
import * as Repositories from '../repositories/';
import { Check } from '../utility/Check';
import * as Exceptions from '../exceptions/';
import { injectable } from 'inversify';
import * as Providers from '../providers/';

@injectable()
export class JobService implements IJobService {
    private _jobRepository: Repositories.JobRepository;
    private _quoteProvider: Providers.IQuotesProvider;
    private _geocodeProvider: Providers.IGeocodeProvider;
    private _boxRepo: Repositories.BoxRepository;
    private _iotPlatform: Providers.IIotPlatform;
    private _moment: any;

    constructor() {
        this._jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this._quoteProvider = kernel.get<Providers.IQuotesProvider>(Types.QuotesProvider);
        this._geocodeProvider = kernel.get<Providers.IGeocodeProvider>(Types.GeocodeProvider);
        this._boxRepo = kernel.get<Repositories.BoxRepository>(Types.BoxRepository);
        this._iotPlatform = kernel.get<Providers.IIotPlatform>(Types.IotPlatform);
        this._moment = require('moment-timezone');
    }

    public async createJob(job: Entities.Job): Promise<Entities.Job> {
        Check.notNull(job, 'job');

        let quote: Providers.Quote = await this._quoteProvider.getRandomQuote();
        if (!!quote) {
            job.name = quote.author;
            job.description = quote.quote;
        }

        let gl: Entities.Geolocation = await this._geocodeProvider.reverse(job.pickup.latitude, job.pickup.longitude);
        if (!!gl) {
            job.pickup.address = gl.address;
        }

        job.status = Entities.JobStatuses.PENDING;
        job.createdAt = this._moment().format();

        return await this._jobRepository.create(job);
    }

    public async cancelJob(job: Entities.Job): Promise<Entities.Job> {
        Check.notNull(job, 'job');

        if (job.status == Entities.JobStatuses.ACCEPTED || job.status == Entities.JobStatuses.IN_PROGRESS) {
            this.tryRemoveBoxFromJob(job);
            job.status = Entities.JobStatuses.CANCELED;
            return await this._jobRepository.update(job);
        } else {
            throw new Exceptions.ServiceLayerException('CANCEL_JOB_FAILED_INVALID_STATUS');
        }
    }

    public async completeJob(job: Entities.Job): Promise<Entities.Job> {
        Check.notNull(job, 'job');

        if (job.status != Entities.JobStatuses.IN_PROGRESS) {
            throw new Exceptions.ServiceLayerException('COMPLETE_JOB_FAILED_INVALID_STATUS');
        }

        this.tryRemoveBoxFromJob(job);
        job.status = Entities.JobStatuses.COMPLETED;

        return await this._jobRepository.update(job);
    }

    public async updatePickup(job: Entities.Job, pickup: Entities.Geolocation): Promise<Entities.Job> {
        Check.notNull(job, 'job');
        Check.notNull(pickup, 'pickup');

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException('PICKUP_UPDATE_FAILED_INVALID_STATUS');
        }

        job.pickup = await this.resolveGeolocation(pickup);

        return await this._jobRepository.update(job);
    }

    public async updateDestination(job: Entities.Job, destination: Entities.Geolocation): Promise<Entities.Job> {
        Check.notNull(job, 'job');
        Check.notNull(destination, 'destination');

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException('DESTINATION_UPDATE_FAILED_INVALID_STATUS');
        }

        job.destination = await this.resolveGeolocation(destination);

        return await this._jobRepository.update(job);
    }

    public async updateReceiver(job: Entities.Job, receiverName: string, receiverPhone: string): Promise<Entities.Job> {
        Check.notNull(job, 'job');

        job.receiverName = receiverName ? receiverName : job.receiverName;
        job.receiverPhone = receiverPhone ? receiverPhone : job.receiverPhone;

        return await this._jobRepository.update(job);
    }

    public async assignCourier(job: Entities.Job, courier: Entities.User): Promise<Entities.Job> {
        Check.notNull(job, 'job');
        Check.notNull(courier, 'courier');

        if (job.status != Entities.JobStatuses.PENDING) {
            throw new Exceptions.ServiceLayerException('COURIER_ASSIGN_FAILED_INVALID_STATUS');
        }

        if (!!job.courierId) {
            throw new Exceptions.ServiceLayerException('COURIER_ASSIGN_FAILED_ALREADY_ASSIGNED');
        }

        job.courierId = courier.id;
        job.status = Entities.JobStatuses.ACCEPTED;

        return await this._jobRepository.update(job);
    }

    public async unassignCourier(job: Entities.Job): Promise<Entities.Job> {
        Check.notNull(job, 'job');

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException('COURIER_UNASSIGN_FAILED_INVALID_STATUS');
        }

        job.courierId = '';
        job.status = Entities.JobStatuses.PENDING;

        return await this._jobRepository.update(job);
    }

    public async updateSize(job: Entities.Job, size: Entities.packageSize): Promise<Entities.Job> {
        Check.notNull(job, 'job');
        Check.notNull(size, 'size');

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException('SIZE_UPDATE_FAILED_INVALID_STATUS');
        }

        job.size = size;

        return await this._jobRepository.update(job);
    }

    public async attachBox(job: Entities.Job, box: Entities.Box): Promise<Entities.Job> {
        Check.notNull(job, 'job');
        Check.notNull(box, 'box');

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_INVALID_STATUS');
        }

        if (box.status == Entities.BoxStatuses.ACTIVE) {
            throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_ALREADY_ATTACHED');
        }

        if (!!job.box) {
            throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_ALREADY_ATTACHED');
        }

        box.status = Entities.BoxStatuses.ACTIVE;
        let updatedBox = await this._boxRepo.update(box);

        if (!!updatedBox && updatedBox.status != Entities.BoxStatuses.ACTIVE) {
            throw new Exceptions.ServiceLayerException('BOX_STATUS_NOT_UPDATED');
        }

        job.box = box.code;
        job.status = Entities.JobStatuses.IN_PROGRESS;
        
       //find starter sensor 
        let starterSensor: Entities.Sensor = box.sensors.find(function (element){
            if(element.type == Entities.SensorTypes.activator){
                return true;
            }
        });

        if(!!starterSensor) {
            starterSensor.value = true;
            await this._iotPlatform.sendDataToSensor(starterSensor);
        }
    
        return await this._jobRepository.update(job);
    }

    private async resolveGeolocation(geolocation: Entities.Geolocation): Promise<Entities.Geolocation> {
        if (!!geolocation.address && !!geolocation.latitude && !!geolocation.longitude) {
            return geolocation;
        }

        if (!!geolocation.address) {
            let coords: Entities.Geolocation = await this._geocodeProvider.geocode(geolocation.address);
            if (coords) {
                geolocation.latitude = coords.latitude;
                geolocation.longitude = coords.longitude;
                return geolocation;
            }
        }

        if (!!geolocation.latitude && !!geolocation.longitude) {
            let address: Entities.Geolocation = await this._geocodeProvider.reverse(geolocation.latitude, geolocation.longitude);
            if (address) {
                geolocation.address = address.address;
                return geolocation;
            }
        }

        throw new Exceptions.ServiceLayerException('GELOCATION_IS_NOT_VALID');
    }

    private async tryRemoveBoxFromJob(job: Entities.Job) {
        if (!!job.box) {
            let box: Entities.Box = await this._boxRepo.findOne({ code: job.box });
            if (!!box) {
                box.status = Entities.BoxStatuses.IDLE;
                //find starter sensor 
                let starterSensor: Entities.Sensor = box.sensors.find(function (element) {
                    if (element.type == Entities.SensorTypes.activator) {
                        return true;
                    }
                });

                if (!!starterSensor) {
                    starterSensor.value = false;
                    await this._iotPlatform.sendDataToSensor(starterSensor);
                }
                this._boxRepo.update(box);
            }
            job.box = null;
        }
    }
}