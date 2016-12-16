import 'reflect-metadata';
import { Server } from './web/Server';
import './web/middleware/globalMiddleware';
import {DB} from './database/DB';

DB.init();
let server: Server = new Server();
let port = process.env.PORT || 8080;

server.listen(port, 'localhost');
