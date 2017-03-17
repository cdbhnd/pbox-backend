import { ILogger, HttpLogEntry } from './ILogger';
require('winston-loggly-bulk');
import * as config from 'config';
import { injectable } from 'inversify';

@injectable()
export class Logger implements ILogger {

    private winston = require('winston');

    constructor() {
        this.winston.add(this.winston.transports.Loggly, {
            token: String(config.get('loggly.token')),
            subdomain: String(config.get('loggly.subdomain')),
            tags: ["Winston-NodeJS"],
            json: true
        });
    }

    public createHttpLog(log: HttpLogEntry): void {
        this.winston.log('HttpLog', log);
    }

    public createGenericLog(log: any): void {
        this.winston.log('Generic log', log);
    }
}