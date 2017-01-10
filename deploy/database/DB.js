"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongodb = require("mongodb");
const config = require("config");
class DB {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            DB.db = yield DB.dbDriver.MongoClient.connect('mongodb://' + config.get('mongoDbSettings.dbUser') + ':' + config.get('mongoDbSettings.dbPassword') + '@ds049641.mlab.com:49641/pbox');
        });
    }
}
DB.dbDriver = mongodb;
exports.DB = DB;
//# sourceMappingURL=DB.js.map