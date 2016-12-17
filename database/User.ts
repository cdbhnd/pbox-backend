import { DB } from './DB';
import { UserRepository } from '../repositories';
import * as Entities from '../entities';
import { injectable } from 'inversify';

@injectable()
export class User implements UserRepository {
    public async create(user: Entities.User): Promise<Entities.User> {
        let result = await DB.db.collection('users').insertOne(user);
        return {
            id: result.ops[0]._id.toString(),
            firstName: result.ops[0].firstName,
            lastName: result.ops[0].lastName,
            username: result.ops[0].username,
            password: result.ops[0].password,
            type: result.ops[0].type
        }
    }

    public async find(query: any): Promise<Entities.User[]> {
        this.convetIdStringToObjectId(query);
        let results = await DB.db.collection('users').find(query).toArray();
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
        if ('_id' in query) {
            let mongoObjectId = DB.dbDriver.ObjectID;
            query._id = new mongoObjectId(query._id);
        }
    }
}

