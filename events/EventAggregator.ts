import { Types, kernel } from '../dependency-injection/';
import { IEventMediator } from './IEventMediator';
import { Box, Sensor, SensorTypes } from '../entities';
import * as config from 'config';

export class EventAggregator {

    public static getMediator(): IEventMediator {
        return kernel.get<IEventMediator>(Types.EventMediator);
    }

    public static getSensorEvent(sensor: Sensor): string {
        switch (sensor.type) {
            case (SensorTypes.gps):
                return EventAggregator.boxGPSChanged;
            case (SensorTypes.temperature):
                return EventAggregator.boxTempChanged;
            case (SensorTypes.vibration):
                return EventAggregator.boxVibrateChanged;
            case (SensorTypes.activator):
                return EventAggregator.BOX_ACTIVATOR_CHANGED;
            default:
                return null;
        }
    }

    public static boxCreated:string = config.get('events.boxCreated') as string;
    public static boxActivated:string = config.get('events.boxActivated') as string;
    public static boxDeactivated:string = config.get('events.boxDeactivated') as string;
    public static BOX_SENSOR_CHANGED:string = config.get('events.boxSensorChanged') as string;
    public static BOX_ACTIVATOR_CHANGED:string = config.get('events.boxActivatorChanged') as string;
    public static boxGPSChanged:string = config.get('events.boxGPSChanged') as string;
    public static boxTempChanged:string = config.get('events.boxTempChanged') as string;
    public static boxHumChanged:string = config.get('events.boxHumChanged') as string;
    public static boxVibrateChanged:string = config.get('events.boxVibrateChanged') as string;
}