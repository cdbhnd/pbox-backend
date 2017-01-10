"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const config = require("config");
const inversify_1 = require("inversify");
const Check_1 = require("../utility/Check");
let GecodeProvider = class GecodeProvider {
    constructor() {
        this._geocoder = require('node-geocoder');
        this._options = config.get('geocode_service');
    }
    geocode(address) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(address, 'address');
            let gc = this._geocoder(this._options);
            let res = yield gc.geocode(address);
            try {
                if (!!res.length && res.length > 0) {
                    return {
                        address: address,
                        latitude: res[0].latitude,
                        longitude: res[0].longitude
                    };
                }
            }
            catch (e) { }
            return null;
        });
    }
    reverse(latitude, longitude) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(latitude, 'latitude');
            Check_1.Check.notNull(longitude, 'longitude');
            let gc = this._geocoder(this._options);
            let res = yield gc.reverse({ lat: latitude, lon: longitude });
            try {
                if (!!res.length && res.length > 0) {
                    return {
                        address: res[0].formattedAddress,
                        latitude: latitude,
                        longitude: longitude
                    };
                }
            }
            catch (e) { }
            return null;
        });
    }
};
GecodeProvider = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], GecodeProvider);
exports.GecodeProvider = GecodeProvider;
//# sourceMappingURL=GeocodeProvider.js.map