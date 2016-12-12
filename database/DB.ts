import * as mongodb from 'mongodb';
import * as config from 'config';

export class DB {
    static dbDriver = mongodb;
    static  db;

    public async init() {
        DB.db = await DB.dbDriver.MongoClient.connect('mongodb://'+config.get('mongoDbSettings.dbUser')+':'+config.get('mongoDbSettings.dbPassword')+'@ds031167.mlab.com:31167/travis');
    }
}