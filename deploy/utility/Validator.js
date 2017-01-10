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
//TODO Custom rules
//TODO indicative library extended with custom rules
function validate(params, constraints, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let validationResult = yield indicative.validateAll(params, constraints);
        }
        catch (error) {
            throw new exceptions_1.ValidationException(error, message);
        }
        ;
    });
}
exports.validate = validate;
//# sourceMappingURL=Validator.js.map