import { IEventSubscriber, IEventMediator, EventAggregator } from './';

export class BoxEvents implements IEventSubscriber {

    public initialize(): void {
        let mediator: IEventMediator = EventAggregator.getMediator();
        mediator.subscribe(EventAggregator.boxSensorChanged, this.storeBoxSensorChange);
    }

    public async storeBoxSensorChange(event: string, data: any) {
        
    }
}