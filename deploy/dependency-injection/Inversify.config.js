"use strict";
const inversify_1 = require("inversify");
const Types_1 = require("./Types");
const Services = require("../services/index");
const Providers = require("../providers/index");
const DB = require("../database/index");
var kernel = new inversify_1.Kernel();
kernel.bind(Types_1.default.JobRepository).to(DB.Jobs);
kernel.bind('entityName').toConstantValue('jobs').whenInjectedInto(DB.Jobs);
kernel.bind(Types_1.default.UserRepository).to(DB.User);
kernel.bind('entityName').toConstantValue('users').whenInjectedInto(DB.User);
kernel.bind(Types_1.default.BoxRepository).to(DB.Boxes);
kernel.bind('entityName').toConstantValue('boxes').whenInjectedInto(DB.Boxes);
kernel.bind(Types_1.default.JobService).to(Services.JobService);
kernel.bind(Types_1.default.QuotesProvider).to(Providers.QuotesProvider);
kernel.bind(Types_1.default.GeocodeProvider).to(Providers.GecodeProvider);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = kernel;
//# sourceMappingURL=Inversify.config.js.map