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
const routing_controllers_1 = require("routing-controllers");
const actions = require("../../actions/");
const httpError_1 = require("../decorators/httpError");
const exceptions_1 = require("../../exceptions");
const authMiddleware_1 = require("../middleware/authMiddleware");
let BoxController = class BoxController {
    getBoxes(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let getBoxesAction = new actions.GetBoxes.Action();
            let actionContext = new actions.ActionContext;
            actionContext.params = { id: userId };
            actionContext.query = request['parsedQuery'];
            let boxes = yield getBoxesAction.run(actionContext);
            return boxes;
        });
    }
};
__decorate([
    routing_controllers_1.Get('/v1.0/boxes'),
    routing_controllers_1.UseBefore(authMiddleware_1.authMiddleware),
    routing_controllers_1.HttpCode(200),
    httpError_1.HttpError(400, exceptions_1.ExceptionTypes.ValidationException),
    __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoxController.prototype, "getBoxes", null);
BoxController = __decorate([
    routing_controllers_1.JsonController(),
    __metadata("design:paramtypes", [])
], BoxController);
exports.BoxController = BoxController;
//# sourceMappingURL=BoxController.js.map