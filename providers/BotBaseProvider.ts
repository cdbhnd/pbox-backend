import { IBotProvider } from './IBotProvider';
import { Box, Bot, BoxStatuses, SensorTypes } from '../entities/';
import { IBoxService } from '../services/';
import { BotRepository, BoxRepository } from '../repositories/';
import { Types, kernel } from "../dependency-injection/";
import { injectable } from 'inversify';

@injectable()
export abstract class BotBaseProvider implements IBotProvider {
    private providerName: string;

    constructor(providerName: string) {
        this.providerName = providerName;
    }

    public abstract subscribe(serviceData: any, box: Box): Promise<boolean>;

    public abstract unsubscribe(serviceData: any, box: Box): Promise<boolean>;

    protected async handshake(chatId: number, boxCode: string): Promise<TextMessage> {
        let botRepo = this.getBotRepository();
        let bot: Bot = await botRepo.findOne({ boxCode: boxCode });

        for (let i = 0; i < bot.services.length; i++) {
            if (bot.services[i].provider == this.providerName) {
                bot.services[i].chatIds = bot.services[i].chatIds ? bot.services[i].chatIds : [];
                bot.services[i].chatIds.push(chatId);
                botRepo.update(bot);
                break;
            }
        }
        return { text: 'Hello I am your personal Box :)' };
    }

    protected async wakeUp(boxCode: string): Promise<TextMessage> {
        let boxRepo = this.getBoxRepository();
        let boxService = this.getBoxService();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            await boxService.activateBox(freshBox);
            return { text: 'Thanks! I am all awake now ;)' };
        } else {
            return { text: 'Well this is embarrassing, I am already awake!' };
        }
    }

    protected async goToSleep(boxCode: string): Promise<TextMessage> {
        let boxRepo = this.getBoxRepository();
        let boxService = this.getBoxService();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            return { text: 'Why do you bothering me when I am already a sleep!' };
        } else {
            await boxService.deactivateBox(freshBox);
            return { text: 'I do not want to go to sleeeeeeep :(' };
        }
    }

    protected async getStatus(boxCode: string): Promise<TextMessage> {
        let boxRepo = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        return { text: 'I am very much ' + freshBox.status + ' at the moment' };
    }

    protected async getLocation(boxCode: string): Promise<LocationMessage> {
        let boxRepo: BoxRepository = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            return {
                text: 'I need to be fully awake and ACTIVE in order to capture the location!',
                latitude: null,
                longitude: null
            };
        }

        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.gps) {
                return {
                    text: 'Here is my current location',
                    latitude: freshBox.sensors[i].value.latitude,
                    longitude: freshBox.sensors[i].value.longitude
                };
            }
        }

        return {
            text: 'I was not able to determine the location!',
            latitude: null,
            longitude: null
        };
    }

    protected async getBatteryStatus(boxCode: string): Promise<TextMessage> {
        let boxRepo: BoxRepository = await this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.battery) {
                let battery: string = freshBox.sensors[i].value.split(',')[0];
                let charging: string = freshBox.sensors[i].value.split(',')[1] == 1 ? 'charging' : 'not charging';
                return { text: 'My current battery status is ' + battery + ' and it is ' + charging };
            }
        }
        return null;
    }

    protected async getName(boxCode: string): Promise<TextMessage> {
        return { text: 'You forgot my name?!?! Well it is ' + boxCode };
    }

    protected async getTemperature(boxCode: string): Promise<TextMessage> {
        let boxRepo: BoxRepository = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            return { text: 'I need to be fully awake and ACTIVE in order to capture the temperature!' };
        }

        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.temperature) {
                return { text: 'My current temperature is ' + freshBox.sensors[i].value.temperature };
            }
        }
        return null;
    }

    protected async getHumidity(boxCode: string): Promise<TextMessage> {
        let boxRepo: BoxRepository = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            return { text: 'I need to be fully awake and ACTIVE in order to capture the humidity!' };
        }

        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.temperature) {
                return { text: 'My current humidity is ' + freshBox.sensors[i].value.humidity };
            }
        }
        return null;
    }

    private getBotRepository(): BotRepository {
        return kernel.get<BotRepository>(Types.BotRepository);
    }

    private getBoxRepository(): BoxRepository {
        return kernel.get<BoxRepository>(Types.BoxRepository);
    }

    private getBoxService() {
        return kernel.get<IBoxService>(Types.BoxService);
    }
}

export class TextMessage {
    public text: string;
}

export class LocationMessage {
    public latitude: number;
    public longitude: number;
    public text: string;
}