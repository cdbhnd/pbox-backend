"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _1 = require("../dependency-injection/");
const Exceptions = require("../exceptions/");
const Entities = require("../entities/");
const index_1 = require("./index");
const ActionBase_1 = require("./ActionBase");
class Action extends ActionBase_1.ActionBase {
    constructor() {
        super();
        this._jobService = _1.kernel.get(_1.Types.JobService);
        this._jobRepo = _1.kernel.get(_1.Types.JobRepository);
        this._userRepo = _1.kernel.get(_1.Types.UserRepository);
    }
    ;
    getConstraints() {
        return {
            'userId': 'required',
            'jobId': 'required'
        };
    }
    getSanitizationPattern() {
        return {};
    }
    onActionExecuting(context) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            // check if job exists
            let job = yield this._jobRepo.findOne({ id: context.params.jobId });
            if (!job) {
                throw new Exceptions.EntityNotFoundException('Job', context.params.jobId);
            }
            context.params.job = job;
            delete context.params.jobId;
            // check if user exists
            let courier = yield this._userRepo.findOne({ id: context.params.userId });
            if (!courier) {
                throw new Exceptions.EntityNotFoundException('User', context.params.userId);
            }
            // check if user is courier
            if (courier.type != Entities.UserType.Courier) {
                throw new Exceptions.UserNotAuthorizedException(courier.username, 'UpdateJob');
            }
            // check if user is authorized to acces the Job
            if (!!job.courierId && courier.id != job.courierId) {
                throw new Exceptions.UserNotAuthorizedException(courier.username, 'UpdateJob');
            }
            context.params.courier = courier;
            delete context.params.userId;
            return _super("onActionExecuting").call(this, context);
        });
    }
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedJob = context.params.job;
            // check if receiverName is updated AND/OR receiverPhone is updated => jobService.updateReceiver
            if (!!context.params.receiverName || !!context.params.receiverPhone) {
                updatedJob = yield this._jobService.updateReceiver(updatedJob, context.params.receiverName, context.params.receiverPhone);
            }
            // check if size is updated => jobService.updateSize
            if (!!context.params.size) {
                let pckSize = context.params.size.toString().toUpperCase();
                updatedJob = yield this._jobService.updateSize(updatedJob, pckSize);
            }
            return updatedJob;
        });
    }
    onError(errorContext) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (!!errorContext.context.params && !!errorContext.context.params.job) {
                errorContext.result = yield this._jobRepo.update(errorContext.context.params.job);
            }
            return _super("onError").call(this, errorContext);
        });
    }
    subActions() {
        return new Array(new index_1.UpdateJobStatus.Action(), new index_1.UpdateJobLocations.Action(), new index_1.UpdateJobCourier.Action(), new index_1.AssignJobBox.Action());
    }
}
exports.Action = Action;
//# sourceMappingURL=UpdateJob.js.map