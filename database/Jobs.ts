import {DB} from './DB';
import {JobsRepository} from '../repositories/';
import * as Entities from '../entities';
import { injectable } from 'inversify';

@injectable()
export class Jobs implements JobsRepository {
    public async create(job: Entities.Job): Promise<Entities.Job> {
        let result = await DB.db.collection('jobs').insertOne(job);
        return result.result.n; //return number of documents inserted
    }
} 