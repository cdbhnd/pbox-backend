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
let JobsController = class JobsController {
    updateJob(jobId, userId, jobUpdateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let action = new actions.UpdateJob.Action();
            let actionContext = new actions.ActionContext();
            actionContext.params = jobUpdateParams;
            actionContext.params.jobId = jobId;
            actionContext.params.userId = userId;
            let updatedJob = yield action.run(actionContext);
            return updatedJob;
        });
    }
    createJob(userId, userCreateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let createJobAction = new actions.CreateJob.Action();
            let actionContext = new actions.ActionContext;
            actionContext.params = userCreateParams;
            actionContext.params.userId = userId;
            let createdJob = yield createJobAction.run(actionContext);
            return createdJob;
        });
    }
    getJobsByUser(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let getJobsByUser = new actions.GetJobs.Action();
            let actionContext = new actions.ActionContext;
            actionContext.params = { id: userId };
            actionContext.query = request['parsedQuery'];
            let userJobs = yield getJobsByUser.run(actionContext);
            return userJobs;
        });
    }
};
__decorate([
    routing_controllers_1.Put('/v1.0/jobs/:jobId'),
    routing_controllers_1.UseBefore(authMiddleware_1.authMiddleware),
    routing_controllers_1.HttpCode(200),
    httpError_1.HttpError(401, exceptions_1.ExceptionTypes.UserNotAuthorizedException),
    httpError_1.HttpError(400, exceptions_1.ExceptionTypes.ValidationException),
    httpError_1.HttpError(400, exceptions_1.ExceptionTypes.ServiceLayerException),
    httpError_1.HttpError(404, exceptions_1.ExceptionTypes.EntityNotFoundException),
    __param(0, routing_controllers_1.Param('jobId')), __param(1, routing_controllers_1.Param('userId')), __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "updateJob", null);
__decorate([
    routing_controllers_1.Post('/v1.0/jobs'),
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.UseBefore(authMiddleware_1.authMiddleware),
    httpError_1.HttpError(400, exceptions_1.ExceptionTypes.ValidationException),
    __param(0, routing_controllers_1.Param('userId')), __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "createJob", null);
__decorate([
    routing_controllers_1.Get('/v1.0/jobs'),
    routing_controllers_1.UseBefore(authMiddleware_1.authMiddleware),
    routing_controllers_1.HttpCode(200),
    httpError_1.HttpError(400, exceptions_1.ExceptionTypes.ValidationException),
    __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobsByUser", null);
JobsController = __decorate([
    routing_controllers_1.JsonController(),
    __metadata("design:paramtypes", [])
], JobsController);
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map