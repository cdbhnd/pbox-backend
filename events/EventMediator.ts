import { IEventMediator } from './IEventMediator';
//import * as PubSub from 'pubsub-js';
import { Check } from '../utility/Check';
import { Types, kernel } from '../dependency-injection/';
import { injectable } from 'inversify';

@injectable()
export class EventMediator implements EventMediator {

    public async subscribe(event: string, callback: (event: string, payload: any) => void): Promise<boolean> {
        
        Check.notNull(event, 'event');
        Check.notNull(callback, 'callback');

        PubSub.subscribe(event, function(msg: string, data: any) {
            callback(msg, data);
        });
        
        return true;
    }

    public async broadcast(event: string, payload: any): Promise<boolean> {

        Check.notNull(event, 'event');

        PubSub.publish(event, payload);

        return true;
    }

}