import { BotBaseProvider, TextMessage, LocationMessage } from './BotBaseProvider';
import { IBot, IBox, SensorTypes, BoxStatuses } from '../entities/';
import { Types, kernel } from "../dependency-injection/";
import { injectable, inject } from 'inversify';
import { IBoxRepository, IBotRepository } from '../repositories/';
import { IBoxService } from '../services/';
import * as config from 'config';
var TelegramBot = require('node-telegram-bot-api');

@injectable()
export class TelegramBotProvider extends BotBaseProvider {
    private boxRepo: IBoxRepository;
    private tBots: Array<TgrBot>;

    constructor( @inject('providerName') providerName: string) {
        super(providerName);
        this.boxRepo = kernel.get<IBoxRepository>(Types.BoxRepository);
        this.tBots = [];
    }

    public async subscribe(bot: IBot): Promise<boolean> {
        let box = await this.getBoxFromBot(bot);
        let serviceData = this.getBotServiceData(bot);
        let tBot = this.createTelegramBot(serviceData.accessToken);

        tBot.onText(/hello|hi/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.handshake(msg.chat.id, box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/name/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getName(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/wake|rise and shine/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.wakeUp(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/sleep|sweet dreams/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.goToSleep(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/status|state/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getStatus(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/location|where|loc/i, (async function onText(msg) {
            let responseMessage: LocationMessage = await this.getLocation(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
            if (responseMessage.latitude && responseMessage.longitude) {
                tBot.sendLocation(msg.chat.id, responseMessage.latitude, responseMessage.longitude);
            }
        }).bind(this));

        tBot.onText(/battery|charge|full|empty|energy/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getBatteryStatus(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/temperature|temp|warm|cold|hot/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getTemperature(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/humidity|wet|rain/i, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getHumidity(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        return true;
    }

    public async unsubscribe(bot: IBot): Promise<boolean> {
        let serviceData = this.getBotServiceData(bot);
        let foundIndex: number = -1;
        for (var i = 0; i < this.tBots.length; i++) {
            if (this.tBots[i].token == serviceData.accessToken) {
                if (this.tBots[i].polling) {
                    await this.tBots[i].bot.stopPolling();
                    foundIndex = i;
                    break;
                } else if (this.tBots[i].webhook) {
                    this.tBots[i].bot.deleteWebHook();
                    foundIndex = i;
                    break;
                }

            }
        }
        if (foundIndex != -1) {
            this.tBots.splice(foundIndex, 1);
        }
        return true;
    }

    public informUsers(bot: IBot, message: string): void {
        for (let i = 0; i < bot.services.length; i++) {
            if (bot.services[i].provider == 'telegram') {
                let tBot = this.getTelegramClient(bot.services[i].accessToken);
                for (let x = 0; x < bot.services[i].chatIds.length; x++) {
                    tBot.sendMessage(bot.services[i].chatIds[x], message);
                }
            }
        }
    }

    public async update(token: string, data: any): Promise<boolean> {
        for (var i = 0; i < this.tBots.length; i++) {
            if (this.tBots[i].token == token && !this.tBots[i].polling) {
                this.tBots[i].bot.processUpdate(data);
                return true;
            }
        }
        return false;
    }

    private createTelegramBot(token): any {
        let telegramConfig: any = config.get('background_tasks.telegram');
        let bot: any;
        if (telegramConfig.polling) {
            bot = new TelegramBot(token, { polling: true });
            this.tBots.push({
                token: token,
                bot: bot,
                polling: true,
                webhook: false
            });
        } else {
            bot = new TelegramBot(token);
            bot.setWebHook(telegramConfig.webhook + '?token=' + token);
            this.tBots.push({
                token: token,
                bot: bot,
                polling: false,
                webhook: true
            });
        }
        return bot;
    }

    private getTelegramClient(token: string) {
        for (let i = 0; i < this.tBots.length; i++) {
            if (this.tBots[i].token == token) {
                return this.tBots[i].bot;
            }
        }
    }

    private async  getBoxFromBot(bot: IBot): Promise<IBox> {
        return await this.boxRepo.findOne({ code: bot.boxCode });
    }

    private getBotServiceData(bot: IBot): any {
        for (let i = 0; i < bot.services.length; i++) {
            if (bot.services[i].provider == this.providerName) {
                return bot.services[i];
            }
        }
    }
}

class TgrBot {
    public token: string;
    public bot: any;
    public polling: boolean;
    public webhook: boolean;
}