import { DB } from './DB';
import { UserRepository } from '../repositories';
import * as Entities from '../entities';
import { injectable } from 'inversify';

@injectable()
export class User implements UserRepository {
    public async create(user: Entities.User): Promise<Entities.User> {
        let result = DB.db.collection('users').insertOne(user);
        return {
            id: result.ops[0]._id.toString(),
            firstName: result.ops[0].firstName,
            lastName: result.ops[0].lastName,
            username: result.ops[0].username,
            password: result.ops[0].password,
            type: result.ops[0].type
        }
    }

     public async find(query): Promise<Entities.User> {
        let result = await DB.db.collection('users').findOne(query);
        return result;
    }
} 