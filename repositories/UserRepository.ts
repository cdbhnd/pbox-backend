import * as Entities from '../entities'

export interface UserRepository {
    create(user: Entities.User): Promise<Entities.User>
    find(query): Promise<Entities.User>
}