"use strict";
const ArgumentNullException_1 = require("../exceptions/ArgumentNullException");
class Check {
    static notNull(param, paramName) {
        if (!param) {
            throw new ArgumentNullException_1.ArgumentNullException(paramName);
        }
    }
}
exports.Check = Check;
//# sourceMappingURL=Check.js.map