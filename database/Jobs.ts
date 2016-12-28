import * as Repos from '../repositories/';
import * as Entities from '../entities';
import { injectable, inject } from 'inversify';
import { BaseRepository } from './BaseRepository';

@injectable()
export class Jobs extends BaseRepository<Entities.Job> implements Repos.JobRepository {

    constructor( @inject('entityName') entityName: string) {
        super(entityName);
    }

    public async create(job: Entities.Job): Promise<Entities.Job> {
        let array = [];
        array.push(job.pickup.longitude);
        array.push(job.pickup.latitude);
        job['loc'] = array;
        let result = await super.create(job);
        return result;
    }

    public async find(query): Promise<Entities.Job[]> {
        var result;
        if (!!query.radiusSearch) {
            let radiusSearchObj = {
                loc:
                {
                    $geoWithin:
                    {
                        $centerSphere:
                        [[query.radiusSearch.lon, query.radiusSearch.lat], query.radiusSearch.radius / 6378.1]
                    }
                }
            }
            delete query.radiusSearch;

            var searchObj = Object.assign(radiusSearchObj, query);

            result = await super.find(searchObj);
        } else {
            result = await super.find(query);
        }
        return result;
    }
}