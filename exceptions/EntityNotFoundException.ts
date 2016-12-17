import {ApplicationException} from './ApplicationException';

export class EntityNotFoundException extends Error implements ApplicationException  {
    public entity: string;
    public identifier: string;
    public name: string;
    public message: string;
    public data:string;

    constructor(entity, identifier, message?, data?) {
        super('ENTITY_NOT_FOUND');
        this.name = 'ENTITY_NOT_FOUND'; 
        this.entity = entity;
        this.identifier = identifier;
        this.message = !!message ? message : 'ENTITY_NOT_FOUND';
        this.data = data;
    }
}