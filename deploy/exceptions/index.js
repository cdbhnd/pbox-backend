"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./ValidationException"));
__export(require("./InvalidCredentialsException"));
__export(require("./EntityNotFoundException"));
__export(require("./UsernameNotAvailableException"));
__export(require("./UserNotAuthorizedException"));
__export(require("./ArgumentNullException"));
__export(require("./ServiceLayerException"));
class ExceptionTypes {
}
ExceptionTypes.ValidationException = 'ValidationException';
ExceptionTypes.InvalidCredentialsException = 'InvalidCredentialsException';
ExceptionTypes.EntityNotFoundException = 'EntityNotFoundException';
ExceptionTypes.UsernameNotAvailableException = 'UsernameNotAvailableException';
ExceptionTypes.UserNotAuthorizedException = 'UserNotAuthorizedException';
ExceptionTypes.ArgumentNullException = 'ArgumentNullException';
ExceptionTypes.ServiceLayerException = 'ServiceLayerException';
exports.ExceptionTypes = ExceptionTypes;
//# sourceMappingURL=index.js.map