import * as Entities from '../entities/';
import { IIotPlatform } from './IIotPlatform';
import * as config from 'config';
import { injectable } from 'inversify';
import {Check} from '../utility/Check';
import * as request from 'request-promise';

@injectable()
export class  IotPlatform implements IIotPlatform  
{
    private baseUrl: string = 'https://api.allthingstalk.io/asset/';
    private options: any = {
        headers: {
            'Auth-ClientId': config.get('iot_platform.att_clientId'),
            'Auth-ClientKey': config.get('iot_platform.att_clientKey'),
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    
    public async getSensorData(sensor: Entities.Sensor): Promise<any> {
        let url =  this.baseUrl + sensor.assetId +'/state';
        let result  = await request.get(url, this.options);
        return result;
    }

    public async sendDataToSensor(sensor: Entities.Sensor): Promise<any> {
        let url = this.baseUrl + sensor.assetId +'/command';
        this.options.body = JSON.stringify({
            value: sensor.value
        });
        let result  = await request.put(url,this.options);
        return result;
    }
}