export class MQTTClient {

    private mqttJsClient: any;

    constructor(jsClient: any) {

        this.mqttJsClient = jsClient;
    }

    public onConnect(callback: Function) {
        this.mqttJsClient.on("connect", (client, userdata, rc) => {
            callback();
        });
    }

    public message(callback: Function) {
        this.mqttJsClient.on("message", (topic, message, packet) => {
            callback(topic, message);
        });
    }

    public onDisconnect(callback: Function) {
        this.mqttJsClient.on("close", () => {
            callback();
        });
    }

    public close() {
        this.mqttJsClient.end(true);
    }
}
