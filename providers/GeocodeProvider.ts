import * as Entities from "../entities/";
import { IGeocodeProvider } from "./IGeocodeProvider";
import * as config from "config";
import { injectable } from "inversify";
import { Check } from "../utility/Check";
import { ILogger } from "../utility";
import { Types, kernel } from "../dependency-injection/";

@injectable()
export class GecodeProvider implements IGeocodeProvider {
    private geocoder: any;
    private options: any;
    private logger: ILogger;

    constructor() {
        this.geocoder = require("node-geocoder");
        this.options = config.get("geocode_service");
        this.logger = kernel.get<ILogger>(Types.Logger);
    }

    public async geocode(address: string): Promise<Entities.IGeolocation> {
        Check.notNull(address, "address");

        let gc = this.geocoder(this.options);

        let res = await gc.geocode(address);

        try {
            if (!!res.length && res.length > 0) {
                return {
                    address: address,
                    latitude: res[0].latitude,
                    longitude: res[0].longitude,
                };
            }
        } catch (e) {
            this.logger.createGenericLog(e);
        }
        return null;
    }

    public async reverse(latitude: number, longitude: number): Promise<Entities.IGeolocation> {
        Check.notNull(latitude, "latitude");
        Check.notNull(longitude, "longitude");

        let gc = this.geocoder(this.options);

        let res = await gc.reverse({ lat: latitude, lon: longitude });

        try {
            if (!!res.length && res.length > 0) {
                return {
                    address: res[0].formattedAddress,
                    latitude: latitude,
                    longitude: longitude,
                };
            }
        } catch (e) {
            this.logger.createGenericLog(e);
        }
        return null;
    }
}
