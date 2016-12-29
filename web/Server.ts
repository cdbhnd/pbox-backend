import * as express from 'express';
import './controllers/';
import * as config from 'config';
import {queryParserMiddleware} from './middleware/queryParserMiddleware';
import {createExpressServer, useExpressServer} from "routing-controllers";

export class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "content-type, Authorization");
            res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
            next();
        });
        this.app.use(queryParserMiddleware);
        this.app.use(express.static(String(config.get('static_folder'))));
        useExpressServer(this.app);
    }

    public listen(port: number) {
        this.app.listen(port);
        console.log(`Application listening at port => ${port}`);
    }
}