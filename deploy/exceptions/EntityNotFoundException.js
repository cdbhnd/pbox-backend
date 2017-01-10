"use strict";
class EntityNotFoundException extends Error {
    constructor(entity, identifier, message, data) {
        super('ENTITY_NOT_FOUND');
        this.name = 'ENTITY_NOT_FOUND';
        this.entity = entity;
        this.identifier = identifier;
        this.message = !!message ? message : entity.toString().toUpperCase() + '_ENTITY_NOT_FOUND';
        this.data = data;
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
//# sourceMappingURL=EntityNotFoundException.js.map