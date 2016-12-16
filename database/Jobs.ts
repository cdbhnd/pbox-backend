import { DB } from './DB';
import { JobRepository } from '../repositories/';
import * as Entities from '../entities';
import { injectable } from 'inversify';

@injectable()
export class Jobs implements JobRepository {
    public async create(job: Entities.Job): Promise<Entities.Job> {
        let result = await DB.db.collection('jobs').insertOne(job);
        let documentStringId = result.ops[0]._id.toString();
        return {
            id: documentStringId,
            pickup: result.ops[0].pickup,
            size: result.ops[0].size,
            status: result.ops[0].status,
            createdAt: result.ops[0].timeStamp
        }
    }

    public async find(query: any): Promise<Entities.Job[]> {
       this.convetIdStringToObjectId(query);
        let results = await DB.db.collection('jobs').find(query).toArray();
        if (results != null) {
            this.convertObjectIdToString(results);
        }
        return results;
    }

    private convertObjectIdToString(results): void {
        for (let i = 0; i < results.length - 1; i++) {
            if (!!results[i]._id) {
                results[i]._id = results[i]._id.toString();
            }
        }
    }

    private convetIdStringToObjectId(query) {
         if('_id' in query) {
            let mongoObjectId = DB.dbDriver.ObjectID;
            query._id = new mongoObjectId(query._id);
        }
    }
} 