import * as express from 'express';
import './controllers/';

import {createExpressServer} from "routing-controllers";

export class Server {
    private app: express.Application;

    constructor() {
        this.app = createExpressServer();
        this.app.use(express.static('assets'));
    }

    public listen(port: number) {
        this.app.listen(port);
        console.log(`Application listening at port => ${port}`);
    }
}