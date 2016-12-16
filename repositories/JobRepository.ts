import * as Entities from '../entities'

export interface JobRepository {
    create(job: Entities.Job): Promise<Entities.Job>
    findByUser(userId: string): Promise<Entities.Job[]>
}