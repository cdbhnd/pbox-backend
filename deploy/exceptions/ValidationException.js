"use strict";
class ValidationException extends Error {
    constructor(data, message) {
        super('VALIDATION_FAILED');
        this.name = 'VALIDATION_FAILED';
        this.data = data;
        this.message = !!message ? message : 'Validaton failed.';
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=ValidationException.js.map