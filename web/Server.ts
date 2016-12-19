import * as express from 'express';
import './controllers/';

import {createExpressServer, useExpressServer} from "routing-controllers";

export class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "content-type");
            next();
        });
        this.app.use(express.static('assets'));
        useExpressServer(this.app);
    }

    public listen(port: number) {
        this.app.listen(port);
        console.log(`Application listening at port => ${port}`);
    }
}