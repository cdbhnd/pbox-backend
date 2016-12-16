import * as Entities from '../entities'

export interface UserRepository {
    create(user: Entities.User): Promise<Entities.User>
    findOneByQuery(query): Promise<Entities.User>
    findUserById(userId: string): Promise<Entities.User>
}