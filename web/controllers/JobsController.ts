import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";
import {JobCreate} from '../../actions/';

@Controller()
export class JobsController {

    @Post("/jobs")
    @HttpCode(200)
    createJob() {
       return "Hello world !!!";
    }

}