import * as Entities from '../entities'

export interface JobsRepository {
    create(job: Entities.Job): Promise<Entities.Job>
}