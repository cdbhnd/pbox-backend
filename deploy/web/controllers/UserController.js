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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const actions = require("../../actions/");
const _1 = require("../../exceptions/");
const routing_controllers_1 = require("routing-controllers");
const jwt = require("jwt-simple");
const config = require("config");
const httpError_1 = require("../decorators/httpError");
let UserController = class UserController {
    createUser(userSubmitedParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let userCreateAction = new actions.CreateUser.Action();
            let actionContext = new actions.ActionContext;
            actionContext.params = userSubmitedParams;
            let createdUser = yield userCreateAction.run(actionContext);
            let secret = String(config.get('secret'));
            createdUser.token = jwt.encode({ authUserId: createdUser.id }, secret);
            return createdUser;
        });
    }
    login(userSubmitedParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let userLoginAction = new actions.LoginUser.Action();
            let actionContext = new actions.ActionContext;
            userSubmitedParams.type = userSubmitedParams.type ? userSubmitedParams.type : 1;
            actionContext.params = userSubmitedParams;
            let userFromDb = yield userLoginAction.run(actionContext);
            let secret = String(config.get('secret'));
            userFromDb.token = jwt.encode({ authUserId: userFromDb.id }, secret);
            return userFromDb;
        });
    }
};
__decorate([
    routing_controllers_1.Post('/v1.0/users'),
    routing_controllers_1.HttpCode(201),
    httpError_1.HttpError(400, _1.ExceptionTypes.ValidationException),
    httpError_1.HttpError(400, _1.ExceptionTypes.UsernameNotAvailableException),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    routing_controllers_1.Post('/v1.0/token'),
    routing_controllers_1.HttpCode(200),
    httpError_1.HttpError(401, _1.ExceptionTypes.InvalidCredentialsException),
    httpError_1.HttpError(400, _1.ExceptionTypes.ValidationException),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
UserController = __decorate([
    routing_controllers_1.JsonController(),
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map