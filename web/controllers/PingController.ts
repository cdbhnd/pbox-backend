import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";
import * as Repo from '../../repositories/';
import * as Entities from '../../entities/';
import { Types, kernel } from "../../dependency-injection/";
import { Stomp } from '../../utility/StompClient';

@Controller()
export class PingController {

    @Get("/ping")
    @HttpCode(200)
    printHello() {
        return "Pong!!!";
    }

    @Get('/stomp')
    @HttpCode(200)
    async listenBoxes() {
        let boxesRepo = kernel.get<Repo.BoxRepository>(Types.BoxRepository);

        let boxes = await boxesRepo.find({ status: Entities.BoxStatuses.ACTIVE });

        for (var i = 0; i < boxes.length; i++) {
            if (!this.boxValid(boxes[i])) {
                continue;
            }
            let host = boxes[i].host.replace('/stomp', '');
            let stomp = new Stomp(boxes[i].deviceId, boxes[i].clientId, boxes[i].clientKey);
            let client = stomp.connectMQTT();
            //let client = stomp.getClient();
            this.connectStomp(client, boxes[i]);
        }

        return "Boxes listeners subscribed";
    }

    private connectStomp(client, box) {
        client.on('message', function onMessage(topic, message, packet) {
            console.log(message);
            let data = JSON.parse(message);
            let boxRepo = kernel.get<Repo.BoxRepository>(Types.BoxRepository);
            for (var i = 0; i < box.sensors.length; i++) {
                if (box.sensors[i].assetId == data.Id) {
                    box.sensors[i].value = this.parseSensorValue(data.Value, box.sensors[i].type);
                    boxRepo.update(box);
                    console.log('Sensor ' + box.sensors[i].type + ' updated');
                }
            }
        });
    }

    private boxValid(box) {
        return (!!box.host && !!box.topic && !!box.clientId && !!box.clientKey && !!box.deviceId);
    }

    private parseSensorValue(value:string, type: string): any 
    {
        if (type == Entities.SensorTypes.gps) 
        {
            let lat = value.split(',')[0];
            let long = value.split(',')[1];
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(long)
            };
        }
        return null;
    }
}