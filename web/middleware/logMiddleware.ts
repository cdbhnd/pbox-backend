var winston = require('winston');
require('winston-loggly-bulk');
import * as config from 'config';

//loggly configuration
winston.add(winston.transports.Loggly, {
    token: String(config.get('loggly.token')),
    subdomain: String(config.get('loggly.subdomain')),
    tags: ["Winston-NodeJS"],
    json: true
});

export async function logMiddleware(req: any, res: any, next: Function) {
    var oldWrite = res.write;
    var oldEnd = res.end;

    var log = {
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

            //record to loggly
            winston.log('info', log);
        } catch (e) {
            console.log('Error occurred in logging middleware ' + e);
        }
        oldEnd.apply(res, arguments);
    };

    next();
}