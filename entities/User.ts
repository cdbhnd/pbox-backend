import {UserType} from './UserTypes';

export interface User {
    id?: string
    firstName?: string,
    lastName?: string,
    username: string,
    password: string,
    type: UserType,
    token?: string
}