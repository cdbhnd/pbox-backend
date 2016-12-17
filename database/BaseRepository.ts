import { DB } from './DB';
import * as mongodb from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class BaseRepository<T> {

    private entityName: string;
    private db: mongodb.Db;

    constructor(entityName: string) {
        DB.init();
        this.entityName = entityName;
        this.db = DB.db;
    }
    
    public async find(query: any): Promise<T[]> {
       this.normalizeSearchQuery(query);
       let result = await DB.db.collection(this.entityName).find(query).toArray();
       if (!!result && !!result.length) {
            for (let i = 0; i < result.length; i++) {
                if (!!result[i]._id) {
                    result[i].id = this.serializeObjectId(result[i]._id);
                    delete result[i]._id;
                }
            }
       }
       return result;
    }

    public async findOne(query: any): Promise<T> {
       this.normalizeSearchQuery(query);
       let result = await DB.db.collection(this.entityName).findOne(query);
       if (!!result) {
            if (!!result._id) {
                result.id = this.serializeObjectId(result._id);
                delete result._id;
            }
       }
       return result;
    }

    public async findAll(): Promise<T[]> {
        return await this.find({});
    } 

    protected collection(): mongodb.Collection {
        return this.db.collection(this.entityName);
    }

    protected normalizeSearchQuery(query: any): any {
        if (!query) {
            query = {};
        }
        if (!!query.id) {
            query._id = this.deserializeObjectId(query.id);
            delete query.id;
        }
        return query;
    }
    
    protected serializeObjectId(objId: mongodb.ObjectID): string {
        if (!!objId) {
            return objId.toString();
        }
        return '';
    }

    protected deserializeObjectId(objectId: string): mongodb.ObjectID {
        if (!!objectId) {
            return new mongodb.ObjectID(objectId);
        }
        return null;
    }
}

