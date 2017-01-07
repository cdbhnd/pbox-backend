import { Kernel } from 'inversify';
import Types from './Types';
import * as Repositories from '../repositories/index';
import * as Services from '../services/index';
import * as Providers from '../providers/index';
import * as DB from '../database/index';
import * as actions from '../actions';

var kernel = new Kernel();

kernel.bind<Repositories.JobRepository>(Types.JobRepository).to(DB.Jobs);
kernel.bind<string>('entityName').toConstantValue('jobs').whenInjectedInto(DB.Jobs);
kernel.bind<Repositories.UserRepository>(Types.UserRepository).to(DB.User);
kernel.bind<string>('entityName').toConstantValue('users').whenInjectedInto(DB.User);
kernel.bind<Repositories.BoxRepository>(Types.BoxRepository).to(DB.Boxes);
kernel.bind<string>('entityName').toConstantValue('boxes').whenInjectedInto(DB.Boxes);

kernel.bind<Services.IJobService>(Types.JobService).to(Services.JobService);
kernel.bind<Providers.IQuotesProvider>(Types.QuotesProvider).to(Providers.QuotesProvider);

export default kernel;

