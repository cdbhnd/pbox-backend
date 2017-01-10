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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const inversify_1 = require("inversify");
const BaseRepository_1 = require("./BaseRepository");
let Jobs = class Jobs extends BaseRepository_1.BaseRepository {
    constructor(entityName) {
        super(entityName);
    }
    create(job) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let array = [];
            array.push(job.pickup.longitude);
            array.push(job.pickup.latitude);
            job['loc'] = array;
            let result = yield _super("create").call(this, job);
            return result;
        });
    }
    find(query) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            var result;
            if (!!query.radiusSearch) {
                let radiusSearchObj = {
                    loc: {
                        $geoWithin: {
                            $centerSphere: [[query.radiusSearch.lon, query.radiusSearch.lat], query.radiusSearch.radius / 6378.1]
                        }
                    }
                };
                delete query.radiusSearch;
                var searchObj = Object.assign(radiusSearchObj, query);
                result = yield _super("find").call(this, searchObj);
            }
            else {
                result = yield _super("find").call(this, query);
            }
            return result;
        });
    }
};
Jobs = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('entityName')),
    __metadata("design:paramtypes", [String])
], Jobs);
exports.Jobs = Jobs;
//# sourceMappingURL=Jobs.js.map