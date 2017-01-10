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
            // check job policies
            let job = yield this._jobRepo.findOne({ id: context.params.jobId });
            if (!job) {
                throw new Exceptions.EntityNotFoundException('Job', context.params.jobId);
            }
            if (job.status != Entities.JobStatuses.ACCEPTED && job.status != Entities.JobStatuses.IN_PROGRESS) {
                throw new Exceptions.ServiceLayerException('CANCEL_FAILED_INVALID_JOB_STATUS');
            }
            context.params.job = job;
            delete context.params.jobId;
            // check courier policies
            let courier = yield this._userRepo.findOne({ id: context.params.userId });
            if (!courier) {
                throw new Exceptions.EntityNotFoundException('User', context.params.userId);
            }
            if (courier.type != Entities.UserType.Courier || courier.id != job.courierId) {
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
            // check if status is CANCELED => jobService.cancelJob
            if (!!context.params.status && context.params.status == Entities.JobStatuses.CANCELED) {
                updatedJob = yield this._jobService.cancelJob(updatedJob);
            }
            // check if status is COMPLETED => jobService.completeJob
            if (!!context.params.status && context.params.status == Entities.JobStatuses.COMPLETED) {
                updatedJob = yield this._jobService.completeJob(updatedJob);
            }
            return updatedJob;
        });
    }
}
exports.Action = Action;
//# sourceMappingURL=UpdateJobStatus.js.map