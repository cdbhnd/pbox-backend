import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";

@Controller()
export class PingController {

    @Get("/ping")
    @HttpCode(200)
    printHello() {
       return "Pong!!!";
    }

}