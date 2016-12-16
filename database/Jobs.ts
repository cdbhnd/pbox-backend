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
            timeStamp: result.ops[0].timeStamp
        }
    }

    public async findOneByQuery(id: string): Promise<Entities.Job> {
        let mongoObjectId = DB.dbDriver.ObjectID;
        let result = await DB.db.collection('jobs').findOne({ "_id": new mongoObjectId(id) });
        let documentStringId = result.ops[0]._id.toString();
        return {
            id: documentStringId,
            pickup: result.ops[0].pickup,
            size: result.ops[0].size,
            status: result.ops[0].status,
            timeStamp: result.ops[0].timeStamp
        }
    }

    public async findByUser(id: string): Promise<Entities.Job[]> {
        let result = await DB.db.collection('jobs').find({ "userId": id }).toArray();
        return result;
    }
} 