import * as Hapi from "hapi";
import * as config from "config";
import { Controller } from "./Controller";
import { Routes } from "./Routes";

export class Process {
    private host: string = String(config.get("background_tasks.host"));
    private port: string = String(config.get("background_tasks.port"));

    public async run() {
        const server = new Hapi.Server();

        server.connection({
            host: this.host,
            port: this.port,
        });

        Routes.register(server);

        server.start(() => {
            console.log("Server running at:", server.info.uri);
        });

        let ctrl: Controller = new Controller();

        ctrl.runBootTasks();
        // ctrl.scheduleCronTasks();
    }
}
