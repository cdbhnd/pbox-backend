import * as Entities from '../entities'

export interface BoxRepository {
    find(query: any): Promise<Entities.Box[]>
    findOne(query: any): Promise<Entities.Box>
    findAll(): Promise<Entities.Box[]>
}