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
const Entities = require("../entities/");
const ActionBase_1 = require("./ActionBase");
const Exceptions = require("../exceptions");
class Action extends ActionBase_1.ActionBase {
    constructor() {
        super();
        this._jobRepository = _1.kernel.get(_1.Types.JobRepository);
        this._userRepository = _1.kernel.get(_1.Types.UserRepository);
    }
    ;
    getConstraints() {
        return {
            'id': 'required'
        };
    }
    getSanitizationPattern() {
        return {};
    }
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var userJobs;
            let userFromDb = yield this._userRepository.findOne({ id: context.params.id });
            if (!userFromDb) {
                throw new Exceptions.EntityNotFoundException('User', '');
            }
            //courier user  can use generic query
            if (userFromDb.type == Entities.UserType.Courier) {
                userJobs = yield this._jobRepository.find(context.query);
            }
            else {
                userJobs = yield this._jobRepository.find({ userId: context.params.id });
            }
            return userJobs;
        });
    }
}
exports.Action = Action;
//# sourceMappingURL=GetJobs.js.map