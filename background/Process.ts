import * as Hapi from "hapi";
import { Types, kernel } from "../dependency-injection/";
import { ListenActiveBoxes } from '../actions/';
import * as tasks from './tasks/';
import * as config from 'config';

export class Process {
    private host: string = String(config.get('background_tasks.host'));
    private port: string = String(config.get('background_tasks.port'));
    private path: string = String(config.get('background_tasks.path'));
    private bootTasks: Array<string> = config.get('background_tasks.boot') as Array<string>;

    public async run() {
        const server = new Hapi.Server();
        server.connection({
            host: this.host,
            port: this.port
        });
        server.route({
            method: 'POST',
            path: this.path,
            handler: this.startTask
        });
        server.start(() => {
            console.log('Server running at:', server.info.uri);
        });

        for (let i = 0; i < this.bootTasks.length; i++) {
            try {
                let task: tasks.ITask = kernel.getNamed<tasks.ITask>(Types.BackgroundTask, this.bootTasks[i]);
                task.execute();
                console.log(this.bootTasks[i] + ' task executed');
            } catch (e) {
                console.log(e);
            }
        }
    }

    protected async startTask(request, reply) {

        let name: string = String(request.params['task']);

        try {
            let task: tasks.ITask = kernel.getNamed<tasks.ITask>(Types.BackgroundTask, name);
            task.execute();
        } catch (e) { }
    }
}

