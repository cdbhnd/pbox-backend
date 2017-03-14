import { Box, Sensor } from '../entities';

export class BoxExtensions {

    public static getSensor(box: Box, sensorType: string): Sensor {
        for (let i: number = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].type == sensorType) {
                return box.sensors[i];
            }
        }
        return null;
    }
}