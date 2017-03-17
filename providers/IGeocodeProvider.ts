import * as Entities from '../entities/';

export interface IGeocodeProvider 
{
    geocode(address: string): Promise<Entities.IGeolocation>
    reverse(latitude: number, longitude: number): Promise<Entities.IGeolocation>
}