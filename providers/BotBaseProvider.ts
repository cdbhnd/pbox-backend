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

    public abstract update(token: string, data: any): Promise<boolean>;

    public abstract informUsers(bot: Bot, message: string): void;

    protected async handshake(chatId: number, boxCode: string): Promise<TextMessage> {
        let botRepo = this.getBotRepository();
        let bot: Bot = await botRepo.findOne({ boxCode: boxCode });
        let message: string = '';

        for (let i = 0; i < bot.services.length; i++) {
            if (bot.services[i].provider == this.providerName) {
                bot.services[i].chatIds = bot.services[i].chatIds ? bot.services[i].chatIds : [];
                if (bot.services[i].chatIds.indexOf(chatId) == -1) {
                    bot.services[i].chatIds.push(chatId);
                    botRepo.update(bot);
                    message = 'Hello I am your personal Box :)';
                } else {
                    message = 'Wooow look who is back :)';
                }
                break;
            }
        }
        return { text: message };
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

        return { text: 'This is my current status: ' + freshBox.status};
    }

    protected async getLocation(boxCode: string): Promise<LocationMessage> {
        let boxRepo: BoxRepository = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });

        let latitude;
        let longitude;

        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.gps) {
                latitude = freshBox.sensors[i].value.latitude
                longitude = freshBox.sensors[i].value.longitude
            }
        }

        if (freshBox.status != BoxStatuses.ACTIVE) {
            if (!!latitude && !!longitude) {
                return {
                    text: 'This is my last known location!',
                    latitude: latitude,
                    longitude: longitude
                }
            }
            return {
                text: 'Man i dont have  a clue, you tell me :)',
                latitude: null,
                longitude: null
            }
        }

        return {
            text: 'This is my current location',
            latitude: latitude,
            longitude: longitude
        };
    }

    protected async getBatteryStatus(boxCode: string): Promise<TextMessage> {
        let boxRepo: BoxRepository = await this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });
        if (freshBox.status == BoxStatuses.ACTIVE) {
            for (let i = 0; i < freshBox.sensors.length; i++) {
                if (freshBox.sensors[i].type == SensorTypes.battery) {
                    let battery: string = freshBox.sensors[i].value.split(',')[0];
                    let charging: string = freshBox.sensors[i].value.split(',')[1] == 1 ? 'charging' : 'not charging';
                    return { text: 'My current battery status is ' + battery + ' and it is ' + charging };
                }
            }
        } else {
            return { text: 'Why are you bothering me, I am sleeping'};
        }
    }

    protected async getName(boxCode: string): Promise<TextMessage> {
        return { text: 'You forgot my name?!?! Well it is ' + boxCode };
    }

    protected async getTemperature(boxCode: string): Promise<TextMessage> {
        let boxRepo: BoxRepository = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });
        let temperature;
        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.temperature) {
                temperature = freshBox.sensors[i].value.temperature;
            }
        }

        if (freshBox.status != BoxStatuses.ACTIVE) {
            if (!!temperature) {
                return { text: 'This is my last known temperature: ' + temperature }
            }
            return { text: 'I dont wanna talk about it, can I go outside and play? ' };
        } else {
            return { text: 'This is my current temperature: ' + temperature };
        }
    }

    protected async getHumidity(boxCode: string): Promise<TextMessage> {
        let boxRepo: BoxRepository = this.getBoxRepository();
        let freshBox: Box = await boxRepo.findOne({ code: boxCode });
        let humidity;
        for (let i = 0; i < freshBox.sensors.length; i++) {
            if (freshBox.sensors[i].type == SensorTypes.temperature) {
                humidity = freshBox.sensors[i].value.humidity;
            }
        }
        
        if (freshBox.status != BoxStatuses.ACTIVE) {
            if(!!humidity) {
                return { text: 'This is my last known humidity: ' + humidity};
            }
            return { text: 'Can I go outside and play?' };
        } else {
            return { text: 'This is my current humidity: ' + humidity};
        }
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