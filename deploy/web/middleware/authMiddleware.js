"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const routing_controllers_1 = require("routing-controllers");
const config = require("config");
const jwt = require("jwt-simple");
const secret = String(config.get('secret'));
let authMiddleware = class authMiddleware {
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.headers.authorization) {
                return response.status(401).end();
            }
            let authorizationString = request.headers.authorization.split(' ');
            if (authorizationString[0] == 'Bearer' && !!authorizationString[1]) {
                try {
                    var decodedToken = jwt.decode(authorizationString[1], secret);
                    if (!request.params) {
                        request.params = {};
                    }
                    request.params.userId = decodedToken.authUserId;
                }
                catch (err) {
                    return response.status(401).end();
                }
            }
            else {
                return response.status(401).end();
            }
            next();
        });
    }
};
authMiddleware = __decorate([
    routing_controllers_1.Middleware(),
    __metadata("design:paramtypes", [])
], authMiddleware);
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map