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
const _2 = require("../exceptions/");
const Password = require("../utility/Password");
const ActionBase_1 = require("./ActionBase");
class Action extends ActionBase_1.ActionBase {
    constructor() {
        super();
        this._userRepository = _1.kernel.get(_1.Types.UserRepository);
    }
    ;
    getConstraints() {
        return {
            'username': 'required',
            'password': 'required',
            'type': 'required'
        };
    }
    getSanitizationPattern() {
        return {
            type: 'to_int'
        };
    }
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let userFromDb = yield this._userRepository.findOne({ username: context.params.username });
            if (userFromDb == null) {
                throw new _2.InvalidCredentialsException(context.params.username, context.params.password);
            }
            let submitedPasswordValid = yield Password.comparePassword(context.params.password, userFromDb.password);
            if (submitedPasswordValid && context.params.type == userFromDb.type) {
                return userFromDb;
            }
            else {
                // throw error 
                throw new _2.InvalidCredentialsException(context.params.username, context.params.password);
            }
        });
    }
}
exports.Action = Action;
//# sourceMappingURL=LoginUser.js.map