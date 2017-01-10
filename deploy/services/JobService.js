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
const _1 = require("../dependency-injection/");
const Entities = require("../entities/");
const Check_1 = require("../utility/Check");
const Exceptions = require("../exceptions/");
const inversify_1 = require("inversify");
let JobService = class JobService {
    constructor() {
        this._jobRepository = _1.kernel.get(_1.Types.JobRepository);
        this._quoteProvider = _1.kernel.get(_1.Types.QuotesProvider);
        this._geocodeProvider = _1.kernel.get(_1.Types.GeocodeProvider);
        this._boxRepo = _1.kernel.get(_1.Types.BoxRepository);
        this._moment = require('moment-timezone');
    }
    createJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            let quote = yield this._quoteProvider.getRandomQuote();
            if (!!quote) {
                job.name = quote.author;
                job.description = quote.quote;
            }
            let gl = yield this._geocodeProvider.reverse(job.pickup.latitude, job.pickup.longitude);
            if (!!gl) {
                job.pickup.address = gl.address;
            }
            job.status = Entities.JobStatuses.PENDING;
            job.createdAt = this._moment().format();
            return yield this._jobRepository.create(job);
        });
    }
    cancelJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            if (job.status == Entities.JobStatuses.ACCEPTED || job.status == Entities.JobStatuses.IN_PROGRESS) {
                job.status = Entities.JobStatuses.CANCELED;
                return yield this._jobRepository.update(job);
            }
            else {
                throw new Exceptions.ServiceLayerException('CANCEL_JOB_FAILED_INVALID_STATUS');
            }
        });
    }
    completeJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            if (job.status != Entities.JobStatuses.IN_PROGRESS) {
                throw new Exceptions.ServiceLayerException('COMPLETE_JOB_FAILED_INVALID_STATUS');
            }
            job.status = Entities.JobStatuses.COMPLETED;
            return yield this._jobRepository.update(job);
        });
    }
    updatePickup(job, pickup) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            Check_1.Check.notNull(pickup, 'pickup');
            if (job.status != Entities.JobStatuses.ACCEPTED) {
                throw new Exceptions.ServiceLayerException('PICKUP_UPDATE_FAILED_INVALID_STATUS');
            }
            if (!job.pickup) {
                job.pickup = {
                    latitude: null,
                    longitude: null,
                    address: null
                };
            }
            job.pickup.latitude = pickup.latitude ? pickup.latitude : job.pickup.latitude;
            job.pickup.longitude = pickup.longitude ? pickup.longitude : job.pickup.longitude;
            job.pickup.address = pickup.address ? pickup.address : job.pickup.address;
            return yield this._jobRepository.update(job);
        });
    }
    updateDestination(job, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            Check_1.Check.notNull(destination, 'destination');
            if (job.status != Entities.JobStatuses.ACCEPTED) {
                throw new Exceptions.ServiceLayerException('DESTINATION_UPDATE_FAILED_INVALID_STATUS');
            }
            if (!job.destination) {
                job.destination = {
                    latitude: null,
                    longitude: null,
                    address: null
                };
            }
            job.destination.latitude = destination.latitude ? destination.latitude : job.destination.latitude;
            job.destination.longitude = destination.longitude ? destination.longitude : job.destination.longitude;
            job.destination.address = destination.address ? destination.address : job.destination.address;
            return yield this._jobRepository.update(job);
        });
    }
    updateReceiver(job, receiverName, receiverPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            job.receiverName = receiverName ? receiverName : job.receiverName;
            job.receiverPhone = receiverPhone ? receiverPhone : job.receiverPhone;
            return yield this._jobRepository.update(job);
        });
    }
    assignCourier(job, courier) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            Check_1.Check.notNull(courier, 'courier');
            if (job.status != Entities.JobStatuses.PENDING) {
                throw new Exceptions.ServiceLayerException('COURIER_ASSIGN_FAILED_INVALID_STATUS');
            }
            if (!!job.courierId) {
                throw new Exceptions.ServiceLayerException('COURIER_ASSIGN_FAILED_ALREADY_ASSIGNED');
            }
            job.courierId = courier.id;
            job.status = Entities.JobStatuses.ACCEPTED;
            return yield this._jobRepository.update(job);
        });
    }
    unassignCourier(job) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            if (job.status != Entities.JobStatuses.ACCEPTED) {
                throw new Exceptions.ServiceLayerException('COURIER_UNASSIGN_FAILED_INVALID_STATUS');
            }
            job.courierId = '';
            job.status = Entities.JobStatuses.PENDING;
            return yield this._jobRepository.update(job);
        });
    }
    updateSize(job, size) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            Check_1.Check.notNull(size, 'size');
            if (job.status != Entities.JobStatuses.ACCEPTED) {
                throw new Exceptions.ServiceLayerException('SIZE_UPDATE_FAILED_INVALID_STATUS');
            }
            job.size = size;
            return yield this._jobRepository.update(job);
        });
    }
    attachBox(job, box) {
        return __awaiter(this, void 0, void 0, function* () {
            Check_1.Check.notNull(job, 'job');
            Check_1.Check.notNull(box, 'box');
            if (job.status != Entities.JobStatuses.ACCEPTED) {
                throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_INVALID_STATUS');
            }
            if (box.status == Entities.BoxStatuses.ACTIVE) {
                throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_ALREADY_ATTACHED');
            }
            if (!!job.box) {
                throw new Exceptions.ServiceLayerException('BOX_ATTACH_FAILED_ALREADY_ATTACHED');
            }
            box.status = Entities.BoxStatuses.ACTIVE;
            let updatedBox = yield this._boxRepo.update(box);
            if (!!updatedBox && updatedBox.status != Entities.BoxStatuses.ACTIVE) {
                throw new Exceptions.ServiceLayerException('BOX_STATUS_NOT_UPDATED');
            }
            job.box = box.code;
            job.status = Entities.JobStatuses.IN_PROGRESS;
            return yield this._jobRepository.update(job);
        });
    }
};
JobService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=JobService.js.map