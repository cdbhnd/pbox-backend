"use strict";
class UserNotAuthorizedException extends Error {
    constructor(username, action) {
        super('USER_NOT_AUTHORIZED');
        this.name = 'USER_NOT_AUTHORIZED';
        this.message = 'USER_' + username.toUpperCase() + '_IS_NOT_AUTHORIZED_FOR_' + action.toUpperCase();
        this.data = 'USER_' + username.toUpperCase() + '_IS_NOT_AUTHORIZED_FOR_' + action.toUpperCase();
    }
}
exports.UserNotAuthorizedException = UserNotAuthorizedException;
//# sourceMappingURL=UserNotAuthorizedException.js.map