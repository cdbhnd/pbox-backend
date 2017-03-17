import * as Entities from "../entities/";

export interface IJobService {
    createJob(job: Entities.Job): Promise<Entities.Job>;
    cancelJob(job: Entities.Job): Promise<Entities.Job>;
    completeJob(job: Entities.Job): Promise<Entities.Job>;
    updatePickup(job: Entities.Job, pickup: Entities.Geolocation): Promise<Entities.Job>;
    updateDestination(job: Entities.Job, pickup: Entities.Geolocation): Promise<Entities.Job>;
    updateReceiver(job: Entities.Job, receiverName: string, receiverPhone: string): Promise<Entities.Job>;
    assignCourier(job: Entities.Job, courier: Entities.User): Promise<Entities.Job>;
    unassignCourier(job: Entities.Job): Promise<Entities.Job>;
    updateSize(job: Entities.Job, size: string): Promise<Entities.Job>;
    attachBox(job: Entities.Job, box: Entities.Box): Promise<Entities.Job>;
}
