import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";

@Controller()
export class HelloWorldController {

    @Get("/hello")
    @HttpCode(200)
    printHello() {
       return "Hello world !!!";
    }

}