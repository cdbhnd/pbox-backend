"use strict";
class ServiceLayerException extends Error {
    constructor(message) {
        super('SERVICE_LAYER_EXCEPTION');
        this.name = 'SERVICE_LAYER_EXCEPTION';
        this.message = message;
        this.data = message;
    }
}
exports.ServiceLayerException = ServiceLayerException;
//# sourceMappingURL=ServiceLayerException.js.map