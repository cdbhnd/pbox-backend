import 'reflect-metadata';
import { Server } from './web/Server';
import './web/middleware/globalMiddleware';
import {DB} from './database/DB';


let server: Server = new Server();

server.listen(8080, 'localhost');
