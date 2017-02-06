var winston = require('winston');
require('winston-loggly-bulk');

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
        if (chunk)
            chunks.push(chunk);

        log.response.body = Buffer.concat(chunks).toString('utf8');
        log.response.headers = res._headers;
        log.response.statusCode = res.statusCode;

        //record to loggly
        winston.add(winston.transports.Loggly, {
            token: "e020724b-a477-40fc-994a-474dcd64107e",
            subdomain: "pbox",
            tags: ["Winston-NodeJS"],
            json: true
        });

        winston.log('info', log);
        /////////////////////////////////////////////////////////
        
        oldEnd.apply(res, arguments);
    };

    next();
}