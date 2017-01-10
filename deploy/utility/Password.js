"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const config = require("config");
const bcrypt = require("bcryptjs");
const saltRounds = Number(config.get('password.saltRounds'));
function generateHash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (error, hash) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(hash);
            });
        });
    });
}
exports.generateHash = generateHash;
function comparePassword(plainPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hash, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response);
            });
        });
    });
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=Password.js.map