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
const Exceptions = require("../exceptions/");
const ActionBase_1 = require("./ActionBase");
const Password_1 = require("../utility/Password");
class Action extends ActionBase_1.ActionBase {
    constructor() {
        super();
        this._userRepository = _1.kernel.get(_1.Types.UserRepository);
    }
    getConstraints() {
        return {
            'username': 'required',
            'password': 'required',
            'type': 'required'
        };
    }
    getSanitizationPattern() {
        return {};
    }
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingUser = yield this._userRepository.findOne({ username: context.params.username });
            if (!!existingUser) {
                throw new Exceptions.UsernameNotAvailableException(context.params.username);
            }
            let user = {
                firstName: context.params.first_name,
                lastName: context.params.last_name,
                username: context.params.username,
                password: yield Password_1.generateHash(context.params.password),
                type: context.params.type
            };
            let createdUser = yield this._userRepository.create(user);
            return createdUser;
        });
    }
}
exports.Action = Action;
//# sourceMappingURL=CreateUser.js.map