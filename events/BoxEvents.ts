import { EventListener } from "./EventListener";
import { EventAggregator } from "./EventAggregator";

export class BoxEvents {

    @EventListener(EventAggregator.BOX_SENSOR_CHANGED)
    public async storeBoxSensorChange(event: string, data: any) {
        // if the value has changed call UpdateSensorValue action
    }

    @EventListener(EventAggregator.BOX_ACTIVATOR_CHANGED)
    public async deactivateBox(event: string, data: any) {
        // if ACTIVATOR value is false call deactivateBox action
    }
}