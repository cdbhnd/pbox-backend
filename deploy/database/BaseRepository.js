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
const DB_1 = require("./DB");
const mongodb = require("mongodb");
const inversify_1 = require("inversify");
let BaseRepository = class BaseRepository {
    constructor(entityName) {
        DB_1.DB.init();
        this.entityName = entityName;
        this.db = DB_1.DB.db;
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.normalizeSearchQuery(query);
            let result = yield DB_1.DB.db.collection(this.entityName).find(query).toArray();
            if (!!result && !!result.length) {
                for (let i = 0; i < result.length; i++) {
                    if (!!result[i]._id) {
                        result[i].id = this.serializeObjectId(result[i]._id);
                        delete result[i]._id;
                    }
                }
            }
            return result;
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.normalizeSearchQuery(query);
            let result = yield DB_1.DB.db.collection(this.entityName).findOne(query);
            if (!!result) {
                if (!!result._id) {
                    result.id = this.serializeObjectId(result._id);
                    delete result._id;
                }
            }
            return result;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.find({});
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.collection().insertOne(entity);
            if (!!result && !!result.ops && !!result.ops.length) {
                if (!!result.ops[0]._id) {
                    result.ops[0].id = this.serializeObjectId(result.ops[0]._id);
                    delete result.ops[0]._id;
                }
                return result.ops[0];
            }
            return null;
        });
    }
    update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let objt = entity;
            let objId = this.deserializeObjectId(objt.id);
            delete objt.id;
            let result = yield this.collection().updateOne({ '_id': objId }, { '$set': objt });
            let updatedDoc = yield this.collection().findOne({ '_id': objId });
            if (!!updatedDoc) {
                if (!!updatedDoc._id) {
                    updatedDoc.id = this.serializeObjectId(updatedDoc._id);
                    delete updatedDoc._id;
                }
            }
            return updatedDoc;
        });
    }
    collection() {
        return this.db.collection(this.entityName);
    }
    normalizeSearchQuery(query) {
        if (!query) {
            query = {};
        }
        if (!!query.id) {
            query._id = this.deserializeObjectId(query.id);
            delete query.id;
        }
        return query;
    }
    serializeObjectId(objId) {
        if (!!objId) {
            return objId.toString();
        }
        return '';
    }
    deserializeObjectId(objectId) {
        if (!!objectId) {
            try {
                return new mongodb.ObjectID(objectId);
            }
            catch (e) {
                return null;
            }
        }
        return null;
    }
};
BaseRepository = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [String])
], BaseRepository);
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map