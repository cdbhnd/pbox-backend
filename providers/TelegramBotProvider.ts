import { BotBaseProvider, TextMessage, LocationMessage } from './BotBaseProvider';
import { Bot, Box, SensorTypes, BoxStatuses } from '../entities/';
import { Types, kernel } from "../dependency-injection/";
import { injectable, inject } from 'inversify';
import { BoxRepository, BotRepository } from '../repositories/';
import { IBoxService } from '../services/';

@injectable()
export class TelegramBotProvider extends BotBaseProvider {

    constructor(@inject('providerName') providerName: string) {
        super(providerName);
    }

    public async subscribe(serviceData: any, box: Box): Promise<boolean> {
        let TelegramBot = require('node-telegram-bot-api');
        let tBot = new TelegramBot(serviceData.accessToken, { polling: true });

        tBot.onText(/Hello/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.handshake(msg.chat.id, box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/name/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getName(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/wake/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.wakeUp(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/sleep/, (async function onText(msg) {
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

        tBot.onText(/battery/, (async function onText(msg) {
            let responseMessage: TextMessage = await this.getBatteryStatus(box.code);
            tBot.sendMessage(msg.chat.id, responseMessage.text);
        }).bind(this));

        tBot.onText(/temperature/, (async function onText(msg) {
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
        return true;
    }
}