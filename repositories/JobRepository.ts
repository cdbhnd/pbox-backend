import * as Entities from '../entities'

export interface JobRepository {
    create(job: Entities.Job): Promise<Entities.Job>
    find(query: any): Promise<Entities.Job[]>
}