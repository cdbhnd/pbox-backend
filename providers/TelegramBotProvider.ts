import { BotBaseProvider, TextMessage, LocationMessage } from './BotBaseProvider';
import { Bot, Box, SensorTypes, BoxStatuses } from '../entities/';
import { Types, kernel } from "../dependency-injection/";
import { injectable, inject } from 'inversify';
import { BoxRepository, BotRepository } from '../repositories/';
import { IBoxService } from '../services/';
import * as config from 'config';
var TelegramBot = require('node-telegram-bot-api');

@injectable()
export class TelegramBotProvider extends BotBaseProvider {

    private tBots: Array<TgrBot>;

    constructor(@inject('providerName') providerName: string) {
        super(providerName);
        this.tBots = [];
    }

    public async subscribe(serviceData: any, box: Box): Promise<boolean> {
        
        let tBot = this.createTelegramBot(serviceData.accessToken);

        tBot.onText(/Hello|hello|hi|Hi/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.handshake(msg.chat.id, box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/name/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getName(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/wake|Wake|rise and shine|Rise and shine/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.wakeUp(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/sleep|Sleep|sweet dreams|Sweet dreams/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.goToSleep(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/status/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getStatus(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/location/, (async function onText(msg) {
            let responseMessage: LocationMessage = await this.getLocation(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
            if (responseMessage.latitude && responseMessage.longitude) {
                tBot.sendLocation(msg.chat.id, responseMessage.latitude, responseMessage.longitude);
            }
        }).bind(this));

        tBot.onText(/battery|charge|full|empty|energy|Battery|Charge|Full|Empty|Energy/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getBatteryStatus(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/temperature|temp|warm|cold|hot|temperature|Temp|Warm|Cold|Hot/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getTemperature(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/humidity/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getHumidity(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        return true;
    }

    public async unsubscribe(serviceData: any, box: Box): Promise<boolean> {
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
            bot =  new TelegramBot(token, { polling: true });
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
}

class TgrBot {
    public token: string;
    public bot: any;
    public polling: boolean;
    public webhook: boolean;
}