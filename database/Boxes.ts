import * as Repos from '../repositories';
import * as Entities from '../entities';
import { injectable, inject } from 'inversify';
import { BaseRepository } from './BaseRepository';

@injectable()
export class Boxes extends BaseRepository<Entities.Box> implements Repos.BoxRepository {
    
    constructor(@inject('entityName') entityName: string) {
        super(entityName);
    }
}
