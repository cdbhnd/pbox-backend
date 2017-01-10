"use strict";
require("reflect-metadata");
const Server_1 = require("./web/Server");
require("./web/middleware/globalMiddleware");
const DB_1 = require("./database/DB");
DB_1.DB.init();
let server = new Server_1.Server();
let port = process.env.PORT || 8080;
server.listen(port);
//# sourceMappingURL=index.js.map