import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { IEventMediator } from "./IEventMediator";

export class EventAggregator {

    public static BOX_CREATED: string = "BOX_CREATED";
    public static BOX_ACTIVATED: string = "BOX_ACTIVATED";
    public static BOX_DEACTIVATED: string = "BOX_DEACTIVATED";
    public static BOX_SENSOR_CHANGED: string = "BOX_SENSOR_CHANGED";
    public static BOX_ACTIVATOR_CHANGED: string = "BOX_ACTIVATOR_CHANGED";
    public static BOX_GPS_CHANGED: string = "BOX_GPS_CHANGED";
    public static BOX_HUMIDITY_CHANGED: string = "BOX_HUMIDITY_CHANGED";
    public static BOX_VIBRATE_CHANGED: string = "BOX_VIBRATE_CHANGED";

    public static getMediator(): IEventMediator {
        return kernel.get<IEventMediator>(Types.EventMediator);
    }
}
