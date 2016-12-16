import { Kernel } from 'inversify';
import Types from './Types';
import * as Repositories from '../repositories/index';
import * as DB from '../database/index';

var kernel = new Kernel();

kernel.bind<Repositories.JobsRepository>(Types.JobsRepository).to(DB.Jobs);
kernel.bind<Repositories.UserRepository>(Types.UserRepository).to(DB.User);
export default kernel;

