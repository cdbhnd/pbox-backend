import { Kernel } from 'inversify';
import Types from './Types';
import * as Repositories from '../repositories/index';
import * as Services from '../services/index';
import * as Providers from '../providers/index';
import * as DB from '../database/index';
import * as actions from '../actions';
import * as bootTasks from '../web/boottasks/';
import * as backgroundTasks from '../background/tasks/';

var kernel = new Kernel();

kernel.bind<Repositories.JobRepository>(Types.JobRepository).to(DB.Jobs);
kernel.bind<string>('entityName').toConstantValue('jobs').whenInjectedInto(DB.Jobs);
kernel.bind<Repositories.UserRepository>(Types.UserRepository).to(DB.User);
kernel.bind<string>('entityName').toConstantValue('users').whenInjectedInto(DB.User);
kernel.bind<Repositories.BoxRepository>(Types.BoxRepository).to(DB.Boxes);
kernel.bind<string>('entityName').toConstantValue('boxes').whenInjectedInto(DB.Boxes);

kernel.bind<Repositories.BotRepository>(Types.BotRepository).to(DB.Bots);
kernel.bind<string>('entityName').toConstantValue('bots').whenInjectedInto(DB.Bots);

kernel.bind<Services.IJobService>(Types.JobService).to(Services.JobService);
kernel.bind<Services.IBoxService>(Types.BoxService).to(Services.BoxService);
kernel.bind<Services.IBotService>(Types.BotService).to(Services.BotService);

kernel.bind<Providers.IQuotesProvider>(Types.QuotesProvider).to(Providers.QuotesProvider);
kernel.bind<Providers.IGeocodeProvider>(Types.GeocodeProvider).to(Providers.GecodeProvider);
kernel.bind<Providers.IIotPlatform>(Types.IotPlatform).to(Providers.AttPlatform).inSingletonScope();

/** Bot Providers */
kernel.bind<Providers.IBotProvider>(Types.BotProvider).to(Providers.TelegramBotProvider).inSingletonScope().whenTargetNamed('telegram');
kernel.bind<string>('providerName').toConstantValue('telegram').whenInjectedInto(Providers.TelegramBotProvider);

/** Background Tasks Registration */
kernel.bind<backgroundTasks.ITask>(Types.BackgroundTask).to(backgroundTasks.ListenActiveBoxesTask).whenTargetNamed('ListenActiveBoxesTask');
kernel.bind<backgroundTasks.ITask>(Types.BackgroundTask).to(backgroundTasks.ActivateBotsTask).whenTargetNamed('ActivateBotsTask');
kernel.bind<backgroundTasks.ITask>(Types.BackgroundTask).to(backgroundTasks.DeactivateBotsTask).whenTargetNamed('DeactivateBotsTask');

export default kernel;