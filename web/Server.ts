import * as express from 'express';
import './controllers/';
import {Parser} from '../utility/Parser';
import {createExpressServer, useExpressServer} from "routing-controllers";

export class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "content-type, Authorization");
            next();
        });
        this.app.use(function(req, res, next) {
            var radiusSerach;
            if(!!req.query.radiusSearch) {
                radiusSerach = JSON.stringify(req.query.radiusSearch);
                delete req.query.radiusSearch;
            }
            var parser = new Parser();
            req['parsedQuery'] = parser.mongodb(req.query);

            if(!!radiusSerach) {
                req['parsedQuery'].radiusSearch = radiusSerach;
            }
            return next();
        });
        this.app.use(express.static('assets'));
        useExpressServer(this.app);
    }

    public listen(port: number) {
        this.app.listen(port);
        console.log(`Application listening at port => ${port}`);
    }
}