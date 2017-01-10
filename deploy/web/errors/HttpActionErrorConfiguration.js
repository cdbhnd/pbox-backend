"use strict";
class HttpActionErrorConfiguration {
    constructor() {
        ///////////////////////////////////////////////////////////////
        this.registryArray = [];
    }
    static getInstance() {
        if (!HttpActionErrorConfiguration.singleInstance) {
            HttpActionErrorConfiguration.singleInstance = new HttpActionErrorConfiguration();
        }
        return HttpActionErrorConfiguration.singleInstance;
    }
    setInConfigurations(actionError) {
        this.registryArray.push(actionError);
    }
    getFromConfigurations(exception, actionName) {
        for (let i = 0; i < this.registryArray.length; i++) {
            if (this.registryArray[i].exception == exception && this.registryArray[i].actionName == actionName) {
                return this.registryArray[i];
            }
        }
    }
}
exports.HttpActionErrorConfiguration = HttpActionErrorConfiguration;
//# sourceMappingURL=HttpActionErrorConfiguration.js.map