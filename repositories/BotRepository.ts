import * as Entities from '../entities'

export interface BotRepository {
    create(box: Entities.IBot): Promise<Entities.IBot>
    find(query: any): Promise<Entities.IBot[]>
    findOne(query: any): Promise<Entities.IBot>
    findAll(): Promise<Entities.IBot[]>
    update(box: Entities.IBot): Promise<Entities.IBot>
    delete(entity: Entities.IBot): Promise<Boolean>
}