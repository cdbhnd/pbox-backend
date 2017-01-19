import * as Entities from '../entities/';
import { IIotPlatform } from './IIotPlatform';
import * as config from 'config';
import { injectable } from 'inversify';
import {Check} from '../utility/Check';
import * as request from 'request-promise';

@injectable()
export class AttPlatform implements IIotPlatform {
    private baseUrl: string = String(config.get('iot_platform.att_host'));
    private options: any = {
        headers: {
            'Auth-ClientId': config.get('iot_platform.att_clientId'),
            'Auth-ClientKey': config.get('iot_platform.att_clientKey'),
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    public async getSensorData(sensor: Entities.Sensor) {
        try {
            let url = this.baseUrl + '/asset/' + + sensor.assetId + '/state';
            await request.get(url, this.options);
        } catch (e) { }
    }

    public async sendDataToSensor(sensor: Entities.Sensor) {
        try {
            let url = this.baseUrl + '/asset/' + sensor.assetId + '/command';
            this.options.body = JSON.stringify({
                value: sensor.value
            });
            await request.put(url, this.options);
        } catch (e) { }
    }
}