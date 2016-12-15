import {HttpActionErrorConfiguration} from '../errors/HttpActionErrorConfiguration';

export function HttpError(errorCode: number, exception: string) {

    return function httpErrorHandler(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

        var originalMethod = descriptor.value;
        let actionErrConfig = HttpActionErrorConfiguration.getInstance();

        // Decore the original function with error try/catch
        descriptor.value = function (...args: any[]) {

            return originalMethod
                .apply(this, args)
                .then(function (data) {
                    return data;
                }).catch(function (err) {
                    let response = global['response_reference'];
                    if (!!response){
                        let exceptionName = !!err.constructor && !!err.constructor.name ? err.constructor.name : 'UNKNOWN_EXCEPTION';
                        let currentErrorConfig = actionErrConfig.getFromConfigurations(exceptionName, originalMethod.name);
                        let code = !!currentErrorConfig ? currentErrorConfig.code : 500;
                        let message = !!currentErrorConfig ? err.message : 'INTERNAL_SERVER_ERROR';
                        return response.status(code).end(JSON.stringify({ message: message, details: err.data }));
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
    }
}

