"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Parser_1 = require("../../utility/Parser");
function queryParserMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let radiusSerach;
        if (!!req.query.radiusSearch) {
            radiusSerach = JSON.parse(req.query.radiusSearch);
            delete req.query.radiusSearch;
        }
        let parser = new Parser_1.Parser();
        req.parsedQuery = parser.mongodb(req.query);
        if (!!radiusSerach) {
            req.parsedQuery.radiusSearch = radiusSerach;
        }
        return next();
    });
}
exports.queryParserMiddleware = queryParserMiddleware;
//# sourceMappingURL=queryParserMiddleware.js.map