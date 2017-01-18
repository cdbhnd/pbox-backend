import * as Entities from '../entities/';
import { IGeocodeProvider } from './IGeocodeProvider';
import * as config from 'config';
import { injectable } from 'inversify';
import {Check} from '../utility/Check';

@injectable()
export class GecodeProvider implements IGeocodeProvider 
{
    private _geocoder: any;
    private _options: any;

    constructor() 
    {
        this._geocoder = require('node-geocoder');
        this._options = config.get('geocode_service');
    }

    public async geocode(address: string): Promise<Entities.Geolocation> 
    {
        Check.notNull(address, 'address');

        let gc = this._geocoder(this._options);

        let res = await gc.geocode(address);

        try {
            if (!!res.length && res.length > 0) 
            {
                return {
                    address: address,
                    latitude: res[0].latitude,
                    longitude: res[0].longitude
                };
            }
        } catch(e) {}

        return null;
    }

    public async reverse(latitude: number, longitude: number): Promise<Entities.Geolocation>
    {
        Check.notNull(latitude, 'latitude');
        Check.notNull(longitude, 'longitude');

        let gc = this._geocoder(this._options);

        let res = await gc.reverse({ lat: latitude, lon: longitude });

        try {
            if (!!res.length && res.length > 0) 
            {
                return {
                    address: res[0].formattedAddress,
                    latitude: latitude,
                    longitude: longitude
                };
            }
        } catch(e) {}

        return null;
    }
}