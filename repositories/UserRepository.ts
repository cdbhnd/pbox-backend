import * as Entities from "../entities";

export interface IUserRepository {
    create(user: Entities.IUser): Promise<Entities.IUser>;
    find(query: any): Promise<Entities.IUser[]>;
    findOne(query: any): Promise<Entities.IUser>;
    findAll(): Promise<Entities.IUser[]>;
}
