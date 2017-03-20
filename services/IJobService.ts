import * as Entities from "../entities/";

export interface IJobService {
    createJob(job: Entities.IJob): Promise<Entities.IJob>;
    cancelJob(job: Entities.IJob): Promise<Entities.IJob>;
    completeJob(job: Entities.IJob): Promise<Entities.IJob>;
    updatePickup(job: Entities.IJob, pickup: Entities.IGeolocation): Promise<Entities.IJob>;
    updateDestination(job: Entities.IJob, pickup: Entities.IGeolocation): Promise<Entities.IJob>;
    updateReceiver(job: Entities.IJob, receiverName: string, receiverPhone: string): Promise<Entities.IJob>;
    assignCourier(job: Entities.IJob, courier: Entities.IUser): Promise<Entities.IJob>;
    unassignCourier(job: Entities.IJob): Promise<Entities.IJob>;
    updateSize(job: Entities.IJob, size: string): Promise<Entities.IJob>;
    attachBox(job: Entities.IJob, box: Entities.IBox): Promise<Entities.IJob>;
}
