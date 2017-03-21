import { IBotProvider } from "../providers/";
import { Types, kernel } from "../dependency-injection/";
import * as tasks from "./tasks/";
import * as config from "config";
import * as schedule from "node-schedule";
import * as actions from "../actions/";

export class Controller {

    private bootTasks: string[] = config.get("background_tasks.boot") as string[];
    private cronTasks: any[] = config.get("background_tasks.cron") as any[];

    public runBootTasks() {
        for (let i = 0; i < this.bootTasks.length; i++) {
            try {
                let task: tasks.ITask = kernel.getNamed<tasks.ITask>(Types.BackgroundTask, this.bootTasks[i]);
                task.execute();
                console.log(this.bootTasks[i] + " task executed");
            } catch (e) {
                console.log(e);
            }
        }
    }

    public scheduleCronTasks() {
        for (let i = 0; i < this.cronTasks.length; i++) {
            let job: schedule.Job;
            try {
                let task: tasks.ITask = kernel.getNamed<tasks.ITask>(Types.BackgroundTask, this.cronTasks[i].name);
                job = schedule.scheduleJob(this.cronTasks[i].rule, task.execute);
                console.log(this.cronTasks[i].name + " task scheduled");
            } catch (e) {
                console.log(e);
                if (!!job) {
                    schedule.cancelJob(job);
                }
            }
        }
    }

    public startTask(name: string, data: any): boolean {

        try {
            let task: tasks.ITask = kernel.getNamed<tasks.ITask>(Types.BackgroundTask, name);
            task.execute();
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public handleNewMessage(providerName: string, token: string, payload: any): boolean {

        console.log("Webhook triggered");
        console.log(providerName);
        console.log(token);
        console.log(payload);
        console.log("--------------------------");

        try {
            let provider: IBotProvider = kernel.getNamed<IBotProvider>(Types.BotProvider, providerName);
            provider.update(token, payload);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public async broadcastEvent(body: any): Promise<boolean> {
        let broadcastEventAction = new actions.BroadcastEvent.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = {};
        actionContext.params.data = body.data;
        actionContext.params.eventName = body.eventName;
        return await broadcastEventAction.run(actionContext);
    }
}
