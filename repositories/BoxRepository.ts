import * as Entities from '../entities'

export interface BoxRepository {
    create(box: Entities.Box): Promise<Entities.Box>
    find(query: any): Promise<Entities.Box[]>
    findOne(query: any): Promise<Entities.Box>
    findAll(): Promise<Entities.Box[]>
    update(box: Entities.Box): Promise<Entities.Box>
    delete(entity: Entities.Box): Promise<Boolean>
}