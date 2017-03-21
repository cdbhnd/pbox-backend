import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { IEventMediator } from "./IEventMediator";

export class EventAggregator {

    public static boxCreated: string = "BOX_CREATED";
    public static boxActivated: string = "BOX_ACTIVATED";
    public static boxDeactivated: string = "BOX_DEACTIVATED";
    public static BOX_SENSOR_CHANGED: string = "BOX_SENSOR_CHANGED";
    public static BOX_ACTIVATOR_CHANGED: string = "BOX_ACTIVATOR_CHANGED";
    public static boxGPSChanged: string = "BOX_GPS_CHANGED";
    public static boxHumidityChanged: string = "BOX_HUMIDITY_CHANGED";
    public static boxVibrateChanged: string = "BOX_VIBRATE_CHANGED";

    public static getMediator(): IEventMediator {
        return kernel.get<IEventMediator>(Types.EventMediator);
    }
}
