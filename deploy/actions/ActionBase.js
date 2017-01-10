"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Validator_1 = require("../utility/Validator");
const Sanitizor_1 = require("../utility/Sanitizor");
class ActionBase {
    run(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (context) === 'undefined') {
                return yield this.execute();
            }
            yield Validator_1.validate(context.params, this.getConstraints());
            context.params = yield Sanitizor_1.sanitize(context.params, this.getSanitizationPattern());
            try {
                context = yield this.onActionExecuting(context);
                let result = yield this.execute(context);
                let subActions = this.subActions();
                for (let i = 0; i < subActions.length; i++) {
                    result = yield subActions[i].execute(context);
                }
                let resultPrepared = yield this.onActionExecuted(result);
                return resultPrepared;
            }
            catch (e) {
                let errorContext = new ErrorContext();
                errorContext.context = context;
                errorContext.exception = e;
                errorContext.handled = false;
                errorContext = yield this.onError(errorContext);
                if (errorContext.handled) {
                    return errorContext.result;
                }
                throw (e);
            }
        });
    }
    onActionExecuting(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return context;
        });
    }
    onActionExecuted(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return result;
        });
    }
    onError(errorContext) {
        return __awaiter(this, void 0, void 0, function* () {
            return errorContext;
        });
    }
    subActions() {
        return new Array();
    }
}
exports.ActionBase = ActionBase;
class ActionContext {
}
exports.ActionContext = ActionContext;
class ErrorContext {
}
exports.ErrorContext = ErrorContext;
//# sourceMappingURL=ActionBase.js.map