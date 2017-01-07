import * as Entities from '../entities/';

export interface IGeocodeProvider 
{
    geocode(address: string): Promise<Entities.Geolocation>
    reverse(latitude: number, longitude: number): Promise<Entities.Geolocation>
}