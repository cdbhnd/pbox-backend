"use strict";
const express = require("express");
require("./controllers/");
const config = require("config");
const queryParserMiddleware_1 = require("./middleware/queryParserMiddleware");
const corsMiddleware_1 = require("./middleware/corsMiddleware");
const routing_controllers_1 = require("routing-controllers");
class Server {
    constructor() {
        this.app = express();
        this.app.use(corsMiddleware_1.corsMiddleware);
        this.app.use(queryParserMiddleware_1.queryParserMiddleware);
        this.app.use(express.static(String(config.get('static_folder'))));
        routing_controllers_1.useExpressServer(this.app);
    }
    listen(port) {
        this.app.listen(port);
        console.log(`Application listening at port => ${port}`);
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map