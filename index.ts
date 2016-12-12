import 'reflect-metadata';
import { Server } from './web/Server';
import './web/middleware/globalMiddleware';

let server: Server = new Server();
server.listen(8080, 'localhost');
