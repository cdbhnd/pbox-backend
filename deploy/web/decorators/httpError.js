"use strict";
const HttpActionErrorConfiguration_1 = require("../errors/HttpActionErrorConfiguration");
function HttpError(errorCode, exception) {
    return function httpErrorHandler(target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        let actionErrConfig = HttpActionErrorConfiguration_1.HttpActionErrorConfiguration.getInstance();
        // Decore the original function with error try/catch
        descriptor.value = function (...args) {
            return originalMethod
                .apply(this, args)
                .then(function (data) {
                return data;
            }).catch(function (err) {
                let response = global['response_reference'];
                if (!!response) {
                    let exceptionName = !!err.constructor && !!err.constructor.name ? err.constructor.name : 'UNKNOWN_EXCEPTION';
                    let currentErrorConfig = actionErrConfig.getFromConfigurations(exceptionName, originalMethod.name);
                    let code = !!currentErrorConfig ? currentErrorConfig.code : 500;
                    let message = !!currentErrorConfig ? err.message : 'INTERNAL_SERVER_ERROR';
                    return response.status(code).end(JSON.stringify({ message: message, details: err.data ? err.data : JSON.stringify(err) }));
                }
                return err;
            });
        };
        // Set HttpActionError in global http error registry
        actionErrConfig.setInConfigurations({
            code: errorCode,
            exception: exception,
            actionName: propertyKey
        });
        return descriptor;
    };
}
exports.HttpError = HttpError;
//# sourceMappingURL=httpError.js.map