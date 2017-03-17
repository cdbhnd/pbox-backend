import { Types, kernel } from "../dependency-injection/";
import { IJobService } from "./IJobService";
import * as Entities from "../entities/";
import * as Repositories from "../repositories/";
import { Check } from "../utility/Check";
import * as Exceptions from "../exceptions/";
import { injectable } from "inversify";
import * as Providers from "../providers/";

@injectable()
export class JobService implements IJobService {
    private jobRepository: Repositories.JobRepository;
    private quoteProvider: Providers.IQuotesProvider;
    private geocodeProvider: Providers.IGeocodeProvider;
    private iotPlatform: Providers.IIotPlatform;
    private moment: any;

    constructor() {
        this.jobRepository = kernel.get<Repositories.JobRepository>(Types.JobRepository);
        this.quoteProvider = kernel.get<Providers.IQuotesProvider>(Types.QuotesProvider);
        this.geocodeProvider = kernel.get<Providers.IGeocodeProvider>(Types.GeocodeProvider);
        this.iotPlatform = kernel.get<Providers.IIotPlatform>(Types.IotPlatform);
        this.moment = require("moment-timezone");
    }

    public async createJob(job: Entities.IJob): Promise<Entities.IJob> {
        Check.notNull(job, "job");

        let quote: Providers.Quote = await this.quoteProvider.getRandomQuote();
        if (!!quote) {
            job.name = quote.author;
            job.description = quote.quote;
            }

        let gl: Entities.IGeolocation = await this.geocodeProvider.reverse(job.pickup.latitude, job.pickup.longitude);
        if (!!gl) {
            job.pickup.address = gl.address;
        }

        job.status = Entities.JobStatuses.PENDING;
        job.createdAt = this.moment().format();

        return await this.jobRepository.create(job);
    }

    public async cancelJob(job: Entities.IJob): Promise<Entities.IJob> {
        Check.notNull(job, "job");

        if (job.status == Entities.JobStatuses.ACCEPTED || job.status == Entities.JobStatuses.IN_PROGRESS) {
            job.box = null;
            job.status = Entities.JobStatuses.CANCELED;
            return await this.jobRepository.update(job);
        } else {
            throw new Exceptions.ServiceLayerException("CANCEL_JOB_FAILED_INVALID_STATUS");
        }
    }

    public async completeJob(job: Entities.IJob): Promise<Entities.IJob> {
        Check.notNull(job, "job");

        if (job.status != Entities.JobStatuses.IN_PROGRESS) {
            throw new Exceptions.ServiceLayerException("COMPLETE_JOB_FAILED_INVALID_STATUS");
        }

        job.box = null;
        job.status = Entities.JobStatuses.COMPLETED;

        return await this.jobRepository.update(job);
    }

    public async updatePickup(job: Entities.IJob, pickup: Entities.IGeolocation): Promise<Entities.IJob> {
        Check.notNull(job, "job");
        Check.notNull(pickup, "pickup");

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("PICKUP_UPDATE_FAILED_INVALID_STATUS");
        }

        job.pickup = await this.resolveGeolocation(pickup);

        return await this.jobRepository.update(job);
    }

    public async updateDestination(job: Entities.IJob, destination: Entities.IGeolocation): Promise<Entities.IJob> {
        Check.notNull(job, "job");
        Check.notNull(destination, "destination");

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("DESTINATION_UPDATE_FAILED_INVALID_STATUS");
        }

        job.destination = await this.resolveGeolocation(destination);

        return await this.jobRepository.update(job);
    }

    public async updateReceiver(job: Entities.IJob, receiverName: string, receiverPhone: string): Promise<Entities.IJob> {
        Check.notNull(job, "job");

        job.receiverName = receiverName ? receiverName : job.receiverName;
        job.receiverPhone = receiverPhone ? receiverPhone : job.receiverPhone;

        return await this.jobRepository.update(job);
    }

    public async assignCourier(job: Entities.IJob, courier: Entities.IUser): Promise<Entities.IJob> {
        Check.notNull(job, "job");
        Check.notNull(courier, "courier");

        if (job.status != Entities.JobStatuses.PENDING) {
            throw new Exceptions.ServiceLayerException("COURIER_ASSIGN_FAILED_INVALID_STATUS");
        }

        if (!!job.courierId) {
            throw new Exceptions.ServiceLayerException("COURIER_ASSIGN_FAILED_ALREADY_ASSIGNED");
        }

        job.courierId = courier.id;
        job.status = Entities.JobStatuses.ACCEPTED;

        return await this.jobRepository.update(job);
    }

    public async unassignCourier(job: Entities.IJob): Promise<Entities.IJob> {
        Check.notNull(job, "job");

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("COURIER_UNASSIGN_FAILED_INVALID_STATUS");
        }

        job.courierId = "";
        job.status = Entities.JobStatuses.PENDING;

        return await this.jobRepository.update(job);
    }

    public async updateSize(job: Entities.IJob, size: Entities.packageSize): Promise<Entities.IJob> {
        Check.notNull(job, "job");
        Check.notNull(size, "size");

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("SIZE_UPDATE_FAILED_INVALID_STATUS");
        }

        job.size = size;

        return await this.jobRepository.update(job);
    }

    public async attachBox(job: Entities.IJob, box: Entities.IBox): Promise<Entities.IJob> {
        Check.notNull(job, "job");
        Check.notNull(box, "box");

        if (job.status != Entities.JobStatuses.ACCEPTED) {
            throw new Exceptions.ServiceLayerException("BOX_ATTACH_FAILED_INVALID_STATUS");
        }

        if (box.status == Entities.BoxStatuses.ACTIVE) {
            throw new Exceptions.ServiceLayerException("BOX_ATTACH_FAILED_ALREADY_ATTACHED");
        }

        if (!!job.box) {
            throw new Exceptions.ServiceLayerException("BOX_ATTACH_FAILED_ALREADY_ATTACHED");
        }

        job.box = box.code;
        job.status = Entities.JobStatuses.IN_PROGRESS;

        return await this.jobRepository.update(job);
    }

    private async resolveGeolocation(geolocation: Entities.IGeolocation): Promise<Entities.IGeolocation> {
        if (!!geolocation.address && !!geolocation.latitude && !!geolocation.longitude) {
            return geolocation;
        }

        if (!!geolocation.address) {
            let coords: Entities.IGeolocation = await this.geocodeProvider.geocode(geolocation.address);
            if (coords) {
                geolocation.latitude = coords.latitude;
                geolocation.longitude = coords.longitude;
                return geolocation;
            }
        }

        if (!!geolocation.latitude && !!geolocation.longitude) {
            let address: Entities.IGeolocation = await this.geocodeProvider.reverse(geolocation.latitude, geolocation.longitude);
            if (address) {
                geolocation.address = address.address;
                return geolocation;
            }
        }

        throw new Exceptions.ServiceLayerException("GELOCATION_IS_NOT_VALID");
    }
}
