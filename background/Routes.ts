import * as Hapi from "hapi";
import { Controller } from "./Controller";

export class Routes {

    public static register(server: Hapi.Server): Hapi.Server {
        server.route({
            method: "GET",
            path: "/ping",
            handler: (request, reply) => {
                return reply("pong");
            },
        });
        server.route({
            method: "POST",
            path: "/execute/{task}",
            handler: (request, reply) => {

                let name: string = String(request.params.task);
                let data: any = request.payload;
                let ctrl: Controller = new Controller();
                let result: boolean = ctrl.startTask(name, data);

                if (result) {
                    return reply("Task executed");
                } else {
                    return reply("Task not executed");
                }
            },
        });
        server.route({
            method: "POST",
            path: "/hooks/broadcast",
            handler: async (request, reply) => {

                let ctrl: Controller = new Controller();
                let result: boolean =  await ctrl.broadcastEvent(request.payload);

                if (result) {
                    return reply("Message handled");
                } else {
                    return reply("Message not handled");
                }
            },
        });
        server.route({
            method: "POST",
            path: "/hooks/{provider}",
            handler: (request, reply) => {

                let providerName: string = String(request.params.provider);
                let token: string = String(request.query.token);

                let ctrl: Controller = new Controller();
                let result: boolean = ctrl.handleNewMessage(providerName, token, request.payload);

                if (result) {
                    return reply("Message handled");
                } else {
                    return reply("Message not handled");
                }
            },
        });
        return server;
    }
}
