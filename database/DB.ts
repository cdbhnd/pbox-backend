import * as mongodb from 'mongodb';
import * as config from 'config';

export class DB {
    static dbDriver = mongodb;
    public static  db;

    public static async init() {
        DB.db = await DB.dbDriver.MongoClient.connect('mongodb://'+config.get('mongoDbSettings.dbUser')+':'+config.get('mongoDbSettings.dbPassword')+'@ds049641.mlab.com:49641/pbox');
    }
}