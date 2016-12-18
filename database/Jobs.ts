import * as Repos from '../repositories/';
import * as Entities from '../entities';
import { injectable, inject } from 'inversify';
import { BaseRepository } from './BaseRepository';

@injectable()
export class Jobs extends BaseRepository<Entities.Job> implements Repos.JobRepository {
    
    constructor(@inject('entityName') entityName: string) {
        super(entityName);
    }
} 