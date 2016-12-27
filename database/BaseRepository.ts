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
       var result;
       this.normalizeSearchQuery(query);
       if(!!query.radiusSearch) {
           let radiusSearchObj = {
               loc:
               {
                   $geoWithin:
                   {
                       $centerSphere:
                       [[query.radiusSearch.lon, query.radiusSearch.lat], query.radiusSearch.radius / 6,378.1]
                   }
               }
           }
           delete query.radiusSearch;

           var searchObj = Object.assign(radiusSearchObj, query);

           result = await DB.db.collection(this.entityName).find(searchObj).toArray();
       } else {
           result = await DB.db.collection(this.entityName).find(query).toArray();
       }
       
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

    public async create(user: T): Promise<T> {
        let result = await this.collection().insertOne(user);
        if (!!result && !!result.ops && !!result.ops.length) {
            if (!!result.ops[0]._id) {
                result.ops[0].id = this.serializeObjectId(result.ops[0]._id);
                delete result.ops[0]._id;
            }
            return result.ops[0];
        }
        return null;
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

