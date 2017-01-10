"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const exceptions_1 = require("../exceptions");
var indicative = require('indicative');
function sanitize(params, sanitizationRules) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sanitizedData = yield indicative.sanitize(params, sanitizationRules);
            return sanitizedData;
        }
        catch (error) {
            throw new exceptions_1.ValidationException(error, 'Sanitizaion failed.');
        }
    });
}
exports.sanitize = sanitize;
//# sourceMappingURL=Sanitizor.js.map