import * as Repos from "../repositories/";
import * as Entities from "../entities";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class Jobs extends BaseRepository<Entities.IJob> implements Repos.IJobRepository {

    constructor( @inject("entityName") entityName: string) {
        super(entityName);
    }

    public async create(job: Entities.IJob): Promise<Entities.IJob> {
        let array = [];
        array.push(job.pickup.longitude);
        array.push(job.pickup.latitude);
        // tslint:disable-next-line:no-string-literal
        job["loc"] = array;
        let result = await super.create(job);
        return result;
    }

    public async find(query): Promise<Entities.IJob[]> {
        let result;
        if (!!query.radiusSearch) {
            let radiusSearchObj = {
                loc:
                {
                    $geoWithin:
                    {
                        $centerSphere:
                        [[query.radiusSearch.lon, query.radiusSearch.lat], query.radiusSearch.radius / 6378.1],
                    },
                },
            };
            delete query.radiusSearch;

            let searchObj = Object.assign(radiusSearchObj, query);

            result = await super.find(searchObj);
        } else {
            result = await super.find(query);
        }
        return result;
    }
}
