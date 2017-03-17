import { ILogger, IHttpLogEntry } from "./ILogger";
import winstonLogglyBulk = require("winston-loggly-bulk");
import * as config from "config";
import { injectable } from "inversify";

@injectable()
export class Logger implements ILogger {

    private winston = require("winston");

    constructor() {
        this.winston.add(this.winston.transports.Loggly, {
            token: String(config.get("loggly.token")),
            subdomain: String(config.get("loggly.subdomain")),
            tags: ["Winston-NodeJS"],
            json: true,
        });
    }

    public createHttpLog(log: IHttpLogEntry): void {
        this.winston.log("HttpLog", log);
    }

    public createErrorLog(log: any): void {
        this.winston.log("Error log", log);
    }
}
