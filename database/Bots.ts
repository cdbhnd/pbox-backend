import * as Repos from '../repositories';
import * as Entities from '../entities';
import { injectable, inject } from 'inversify';
import { BaseRepository } from './BaseRepository';

@injectable()
export class Bots extends BaseRepository<Entities.Bot> implements Repos.BotRepository {
    
    constructor(@inject('entityName') entityName: string) {
        super(entityName);
    }
}
