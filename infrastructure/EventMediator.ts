import { Types, kernel } from "../dependency-injection/";
import { injectable } from "inversify";
import * as PubSub from "pubsub-js";
import { IEventMediator } from "./IEventMediator";

@injectable()
export class EventMediator implements IEventMediator {

    public subscribe(eventName: string, callback: Function): string {
        return PubSub.subscribe(event, callback);
    }

    public unsubscribe(indentifier: string): void {
        PubSub.unsubscribe(indentifier);
    }

    public boradcastEvent(eventName: string, data: any): void {
        PubSub.publish(eventName, data);
    }
}
