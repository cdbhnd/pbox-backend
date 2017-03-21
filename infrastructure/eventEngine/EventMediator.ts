import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { injectable } from "inversify";
import * as PubSub from "pubsub-js";
import { IEventMediator } from "./IEventMediator";
import * as request from "request-promise";
import * as config from "config";

@injectable()
export class EventMediator implements IEventMediator {

    public subscribe(eventName: string, callback: Function): string {
        return PubSub.subscribe(eventName, callback);
    }

    public unsubscribe(indentifier: string): void {
        PubSub.unsubscribe(indentifier);
    }

    public boradcastEvent(eventName: string, data: any): void {
        PubSub.publish(eventName, data);
    }

    public async broadcastEventToHooks(eventName: string, data: any) {
        let systemsToBeNotified: string[] = config.get("eventSettings.instance_urls") as string[];
        let options: any = {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: eventName, data: data,
            }),
        };

        try {
            for (let i = 0; i < systemsToBeNotified.length; i++) {
                await request.post(systemsToBeNotified[i], options);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
