import * as Entities from '../entities'

export interface BotRepository {
    create(box: Entities.Bot): Promise<Entities.Bot>
    find(query: any): Promise<Entities.Bot[]>
    findOne(query: any): Promise<Entities.Bot>
    findAll(): Promise<Entities.Bot[]>
    update(box: Entities.Bot): Promise<Entities.Bot>
    delete(entity: Entities.Bot): Promise<Boolean>
}