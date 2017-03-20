import { IBotProvider } from "./IBotProvider";
import { IBox, IBot, BoxStatuses, SensorTypes } from "../entities/";
import { IBoxService } from "../services/";
import { IBotRepository, IBoxRepository } from "../repositories/";
import { Types, kernel } from "../dependency-injection/";
import { injectable } from "inversify";

@injectable()
export abstract class BotBaseProvider implements IBotProvider {
    protected providerName: string;

    constructor(providerName: string) {
        this.providerName = providerName;
    }

    public abstract subscribe(bot: IBot): Promise<boolean>;

    public abstract unsubscribe(bot: IBot): Promise<boolean>;

    public abstract update(token: string, data: any): Promise<boolean>;

    public abstract informUsers(bot: IBot, message: string): void;

    protected async handshake(chatId: number, boxCode: string): Promise<TextMessage> {
        let botRepo = this.getBotRepository();
        let bot: IBot = await botRepo.findOne({ boxCode: boxCode });
        let message: string = "";

        for (let i = 0; i < bot.services.length; i++) {
            if (bot.services[i].provider == this.providerName) {
                bot.services[i].chatIds = bot.services[i].chatIds ? bot.services[i].chatIds : [];
                if (bot.services[i].chatIds.indexOf(chatId) == -1) {
                    bot.services[i].chatIds.push(chatId);
                    botRepo.update(bot);
                    message = "Hello I am your personal Box :)";
                } else {
                    message = "Wooow look who is back :)";
                }
                break;
            }
        }
        return { text: message };
    }

    protected async wakeUp(boxCode: string): Promise<TextMessage> {
        let boxRepo = this.getBoxRepository();
        let boxService = this.getBoxService();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            await boxService.activateBox(freshBox);
            return { text: "Thanks! I am all awake now ;)" };
        } else {
            return { text: "Well this is embarrassing, I am already awake!" };
        }
    }

    protected async goToSleep(boxCode: string): Promise<TextMessage> {
        let boxRepo = this.getBoxRepository();
        let boxService = this.getBoxService();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });

        if (freshBox.status != BoxStatuses.ACTIVE) {
            return { text: "Why do you bothering me when I am already a sleep!" };
        } else {
            await boxService.deactivateBox(freshBox);
            return { text: "I do not want to go to sleeeeeeep :(" };
        }
    }

    protected async getStatus(boxCode: string): Promise<TextMessage> {
        let boxRepo = this.getBoxRepository();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });
        return { text: "This is my current status: " + freshBox.status };
    }

    protected async getLocation(boxCode: string): Promise<LocationMessage> {
        let boxRepo: IBoxRepository = this.getBoxRepository();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });

        let sensorValue = this.getSensorValue(freshBox, SensorTypes.gps);

        if (freshBox.status != BoxStatuses.ACTIVE) {
            if (!!sensorValue.latitude && !!sensorValue.longitude) {
                return {
                    text: "This is my last known location!",
                    latitude: sensorValue.latitude,
                    longitude: sensorValue.longitude,
                };
            }
            return {
                text: "Man i dont have  a clue, you tell me :)",
                latitude: null,
                longitude: null,
            };
        }

        return {
            text: "This is my current location",
            latitude: sensorValue.latitude,
            longitude: sensorValue.longitude,
        };
    }

    protected async getBatteryStatus(boxCode: string): Promise<TextMessage> {
        let boxRepo: IBoxRepository = await this.getBoxRepository();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });
        if (freshBox.status == BoxStatuses.ACTIVE) {
            let sensorValue = this.getSensorValue(freshBox, SensorTypes.battery);
            let chargingStatus = sensorValue.split(",")[1] == 1 ? "charging." : "not charging.";
            return { text: "My current battery status is " + sensorValue.split(",")[0] + " and it is " + chargingStatus };
        } else {
            return { text: "Why are you bothering me, I am sleeping" };
        }
    }

    protected async getName(boxCode: string): Promise<TextMessage> {
        return { text: "You forgot my name?!?! Well it is " + boxCode };
    }

    protected async getTemperature(boxCode: string): Promise<TextMessage> {
        let boxRepo: IBoxRepository = this.getBoxRepository();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });
        let sensorValue = this.getSensorValue(freshBox, SensorTypes.temperature);

        if (freshBox.status != BoxStatuses.ACTIVE) {
            if (!!sensorValue.temperature) {
                return { text: "This is my last known temperature: " + sensorValue.temperature };
            }
            return { text: "I dont wanna talk about it, can I go outside and play? " };
        } else {
            return { text: "This is my current temperature: " + sensorValue.temperature };
        }
    }

    protected async getHumidity(boxCode: string): Promise<TextMessage> {
        let boxRepo: IBoxRepository = this.getBoxRepository();
        let freshBox: IBox = await boxRepo.findOne({ code: boxCode });
        let sensorValue = this.getSensorValue(freshBox, SensorTypes.temperature);

        if (freshBox.status != BoxStatuses.ACTIVE) {
            if (!!sensorValue.humidity) {
                return { text: "This is my last known humidity: " + sensorValue.humidity };
            }
            return { text: "Can I go outside and play?" };
        } else {
            return { text: "This is my current humidity: " + sensorValue.humidity };
        }
    }

    private getSensorValue(box: IBox, sensor: SensorTypes): any {
        for (let i = 0; i < box.sensors.length; i++) {
            if (box.sensors[i].type == sensor) {
                return box.sensors[i].value;
            }
        }
    }

    private getBotRepository(): IBotRepository {
        return kernel.get<IBotRepository>(Types.BotRepository);
    }

    private getBoxRepository(): IBoxRepository {
        return kernel.get<IBoxRepository>(Types.BoxRepository);
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
