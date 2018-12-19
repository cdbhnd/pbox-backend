import * as Repos from '../repositories';
import * as Entities from '../entities';
import { injectable, inject } from 'inversify';
import { BaseRepository } from './BaseRepository';
import * as mongodb from 'mongodb';

@injectable()
export class Boxes extends BaseRepository<Entities.Box> implements Repos.BoxRepository {

    constructor( @inject('entityName') entityName: string) {
        super(entityName);
    }

    public async logSensorState(box: Entities.Box, sensor: Entities.Sensor): Promise<boolean> {

        try {
            let boxLog: mongodb.Collection = await this.db.collection(box.code);
            await boxLog.insertOne(new SensorState(sensor.code, sensor.type, sensor.value));
            return true;
        } catch (e) {
            return false;
        }
    }

    public async updateBoxSensor(box: Entities.Box, sensor: Entities.SensorTypes, value: any): Promise<Entities.Box> {
        let objt = box;
        let timestamp = new Date().getTime();

        let objId = this.deserializeObjectId(objt.id);

        let result = await this.collection().updateOne({ '_id': objId, "sensors.name" : sensor }, {"$set" : {"sensors.$.value" : value, "sensors.$.timestamp": timestamp}});

        let updatedDoc = await this.collection().findOne({ '_id': objId });

        if (!!updatedDoc) {
            if (!!updatedDoc._id) {
                updatedDoc.id = this.serializeObjectId(updatedDoc._id);
                delete updatedDoc._id;
            }
        }
        return updatedDoc;
    }
}

class SensorState {

    constructor(code: string, type: string, value: any) {
        this.code = code;
        this.type = type;
        this.value = value;
        this.timestamp = (new Date()).toISOString();
    }

    public code: string;
    public type: string;
    public timestamp: string;
    public value: any;
}
