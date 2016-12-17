import * as Repos from '../repositories/';
import * as Entities from '../entities';
import { injectable, inject } from 'inversify';
import { BaseRepository } from './BaseRepository';

@injectable()
export class Jobs extends BaseRepository<Entities.Job> implements Repos.JobRepository {
    
    constructor(@inject('entityName') entityName: string) {
        super(entityName);
    };
    
    public async create(job: Entities.Job): Promise<Entities.Job> {
        let result = await this.collection().insertOne(job);
        let documentStringId = result.ops[0]._id.toString();
        return {
            id: documentStringId,
            pickup: result.ops[0].pickup,
            size: result.ops[0].size,
            status: result.ops[0].status,
            createdAt: result.ops[0].timeStamp
        };
    };
} 