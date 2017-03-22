import {EventListener} from "./decorators/EventListener";
import {EventAggregator} from "../infrastructure/eventEngine/EventAggregator";

export class BoxEventsController {
    @EventListener(EventAggregator.BOX_SENSOR_CHANGED)
    public async storeBoxSensorChange(event: string, data: any) {
        console.log("Store box sensor change metod called with event: " + event + "data: " + data );
    }

    @EventListener(EventAggregator.BOX_ACTIVATOR_CHANGED)
    public async deactivateBox(event: string, data: any) {
        console.log("Deactivate metod called with event: " + event + "data: " + data );
    }
}
