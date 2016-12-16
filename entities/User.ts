export interface User {
    id?: string
    firstName?: string,
    lastName?: string,
    username: string,
    password: string,
    type: userType,
    token?: string
}

const enum userType {
    guest,
    customer,
    courier
}