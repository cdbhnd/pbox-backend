import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { IEventMediator } from "./IEventMediator";

export class EventAggregator {

    public static ATT_ACTIVATOR_NEW_READING: string = "ATT_ACTIVATOR_NEW_READING";
    public static ATT_VIBRATION_NEW_READING: string = "ATT_VIBRATION_NEW_READING";
    public static ATT_NEW_SENSOR_VALUE: string = "ATT_NEW_SENSOR_VALUE";
    public static getMediator(): IEventMediator {
        return kernel.get<IEventMediator>(Types.EventMediator);
    }
}
