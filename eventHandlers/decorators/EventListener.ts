import {EventAggregator} from "../../infrastructure/eventEngine/EventAggregator";

export function EventListener(event: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        let originalMethod = descriptor.value;

        let eventMediator = EventAggregator.getMediator();
        eventMediator.subscribe(event, originalMethod);
    };
}
