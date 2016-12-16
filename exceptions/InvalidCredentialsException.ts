import {ApplicationException} from './ApplicationException';

export class InvalidCredentialsException extends Error implements ApplicationException {
    public encrypted_password: string;
    public username: string;
    public data:string;

    constructor(username, encrypted_password, message?, data?) {
        super('INVALID_CREDENTIALS');
        this.name = 'INVALID_CREDENTIALS';
        this.username = username;
        this.encrypted_password = encrypted_password;
        this.message = !!message ? message : 'INVALID_CREDENTIALS';
        this.data = data;
    }
}