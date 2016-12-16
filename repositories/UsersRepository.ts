import * as Entities from '../entities'

export interface UsersRepository {
    create(user: Entities.User): Promise<Entities.User> 
}