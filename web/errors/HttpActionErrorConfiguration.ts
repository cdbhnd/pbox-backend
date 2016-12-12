import {HttpActionError} from './HttpActionError'

export class HttpActionErrorConfiguration {

    private static singleInstance: HttpActionErrorConfiguration;

    static getInstance(): HttpActionErrorConfiguration {
        
        if (!HttpActionErrorConfiguration.singleInstance) {
            HttpActionErrorConfiguration.singleInstance = new HttpActionErrorConfiguration();
        }
        
        return HttpActionErrorConfiguration.singleInstance;
    }

    ///////////////////////////////////////////////////////////////

    private registryArray: HttpActionError[] = [];

    setInConfigurations(actionError: HttpActionError) {
        this.registryArray.push(actionError);
    }

    getFromConfigurations(exception: string, actionName: string): HttpActionError {
        for (let i = 0; i < this.registryArray.length; i++) {
            if (this.registryArray[i].exception == exception && this.registryArray[i].actionName == actionName) {
                return this.registryArray[i];
            }
        }
    }
}