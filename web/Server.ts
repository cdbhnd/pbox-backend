import * as express from 'express';
import './controllers/';

import {createExpressServer} from "routing-controllers";

export class Server {
    private app: express.Application;

    constructor() {
        this.app = createExpressServer();
    }

    public listen(port: number, address: string) {
        this.app.listen(port, address);
        console.log(`Application listening at ${address}:${port}`);
    }
}