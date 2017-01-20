export class Stomp {
    private mqtt = require('mqtt');
    private mqttClient = undefined;
    private ATT: any = {};

    constructor(deviceId: string, clientId: string, clientKey: string) {

        this.ATT.credentials = {
            deviceId: deviceId,
            clientId: clientId,
            ClientKey: clientKey

        };
        this.ATT.baseHttpUrl = 'http://api.allthingstalk.io';
        this.ATT.baseMQTTUrl = 'api.allthingstalk.io';
        this.ATT.basePort = '1883';
        this.ATT.mqttStatus = false;
    }

    public connectMQTT() {
        return this.connect(this.ATT.baseMQTTUrl, this.ATT.basePort);
    }

    private connect(url, port): any {

        var mqttId = this.ATT.credentials.deviceId.length > 23 ? this.ATT.credentials.deviceId.substring(0, 23) : this.ATT.credentials.deviceId;

        //Funky requirements for RabbitMq MQTT Auth
        var brokerId = this.ATT.credentials.clientId + ':' + this.ATT.credentials.clientId;

        var topic = 'client/' + this.ATT.credentials.clientId + '/in/device/' + this.ATT.credentials.deviceId + '/asset/+/state';

        this.mqttClient = this.mqtt.createClient(port || 1883, url || this.ATT.baseMQTTUrl, {
                clientId: mqttId,
                username: brokerId,
                password: this.ATT.credentials.ClientKey
            })
            .subscribe(topic);
            /*.on('message', function onMessage(topic, message, packet) {
                console.log('Incoming message - topic: ' + topic + ', payload: ' + message);
                var topicParts = topic.split('/');

            })
            .on('connect', function onConnect(client, userdata, rc) {
                console.log('Connected to the MQTT broker.');
                console.log('Subscribing to: ' + topic);
                //this.ATT.mqttStatus = true;
            })
            .on('offline', function onOffline(client, userdata, rc) {
                console.log('Lost connection to the MQTT broker - reconnecting...');
                //this.ATT.mqttStatus = false;
            });*/

        return this.mqttClient;
    }
}



