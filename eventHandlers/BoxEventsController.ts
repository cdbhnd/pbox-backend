import { EventListener } from "./decorators/EventListener";
import { EventAggregator } from "../infrastructure/eventEngine/EventAggregator";
import * as Actions from "../actions";

export class BoxEventsController {

    @EventListener(EventAggregator.ATT_NEW_SENSOR_VALUE)
    public async storeBoxSensorChange(event: string, data: any) {
        let saveBoxSensorChangeAction = new Actions.SaveBoxSensorChange.Action();
        let actionContext = new Actions.ActionContext();
        actionContext.params = {};
        actionContext.params.newSensorValue = data.newSensorValue;
        actionContext.params.box = data.box;
        actionContext.params.sensorType = data.sensorType;
        await saveBoxSensorChangeAction.run(actionContext);
    }

    @EventListener(EventAggregator.ATT_ACTIVATOR_NEW_READING)
    public async deactivateBox(event: string, data: any) {
        let deactivateBoxAction = new Actions.DeactivateBox.Action();
        let actionContext = new Actions.ActionContext();
        actionContext.params = {};
        actionContext.params.newSensorValue = data.newSensorValue;
        actionContext.params.box = data.box;
        await deactivateBoxAction.run(actionContext);
    }
}
