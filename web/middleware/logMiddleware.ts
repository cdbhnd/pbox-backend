import { Types, kernel } from "../../dependency-injection/";
import {ILogger, HttpLogEntry} from "../../utility/ILogger";

var logger: ILogger = kernel.get<ILogger>(Types.Logger);

export async function logMiddleware(req: any, res: any, next: Function) {
    var oldWrite = res.write;
    var oldEnd = res.end;

    var log: HttpLogEntry = {
        createdAt: new Date(),
        request: {
            headers: req.headers,
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
            body: req.body
        },
        response: {
            headers: null,
            statusCode: null,
            body: null
        },
    };

    var chunks = [];

    res.write = function (chunk) {
        chunks.push(chunk);

        oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        try {
            if (chunk)
                chunks.push(chunk);
            //if exception is trown, chunk is string
            if (typeof chunk == 'string') {
                log.response.body = chunk;
            } else {
                log.response.body = Buffer.concat(chunks).toString('utf8');
            }

            log.response.headers = res._headers;
            log.response.statusCode = res.statusCode;

            logger.createHttpLog(log);
        } catch (e) {
            console.log('Error occurred in logging middleware ' + e);
        }
        oldEnd.apply(res, arguments);
    };

    next();   
}