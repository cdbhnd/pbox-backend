"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _1 = require("../dependency-injection/");
const ActionBase_1 = require("./ActionBase");
var moment = require('moment-timezone');
class Action extends ActionBase_1.ActionBase {
    constructor() {
        super();
        this._jobService = _1.kernel.get(_1.Types.JobService);
    }
    ;
    getConstraints() {
        return {
            'userId': 'required',
            'size': 'required',
            'pickup.latitude': 'required',
            'pickup.longitude': 'required' //TODO write rule for number
        };
    }
    getSanitizationPattern() {
        return {};
    }
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let job = {
                id: null,
                pickup: context.params.pickup,
                name: null,
                destination: {
                    latitude: null,
                    longitude: null,
                    address: null
                },
                size: context.params.size,
                status: null,
                createdAt: null,
                userId: context.params.userId,
                courierId: null,
                box: null
            };
            return yield this._jobService.createJob(job);
        });
    }
}
exports.Action = Action;
//# sourceMappingURL=CreateJob.js.map