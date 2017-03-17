import * as Entities from '../entities'

export interface JobRepository {
    create(job: Entities.IJob): Promise<Entities.IJob>
    find(query: any): Promise<Entities.IJob[]>
    findOne(query: any): Promise<Entities.IJob>
    findAll(): Promise<Entities.IJob[]>
    update(job: Entities.IJob): Promise<Entities.IJob>
}