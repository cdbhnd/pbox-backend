"use strict";
class InvalidCredentialsException extends Error {
    constructor(username, encrypted_password, message, data) {
        super('INVALID_CREDENTIALS');
        this.name = 'INVALID_CREDENTIALS';
        this.username = username;
        this.encrypted_password = encrypted_password;
        this.message = !!message ? message : 'INVALID_CREDENTIALS';
        this.data = data;
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
//# sourceMappingURL=InvalidCredentialsException.js.map