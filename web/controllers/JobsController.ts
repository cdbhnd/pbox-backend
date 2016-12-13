import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController } from "routing-controllers";
import { CreateJob, ActionBase } from '../../actions/';
import {HttpError} from '../decorators/httpError';
import {ExceptionTypes} from '../../exceptions';

@JsonController()
export class JobsController {

    @Post("/jobs")
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createJob( @Body() userCreateParams: any) {
        let createJobAction = new CreateJob.Action();
        let actionContext = new ActionBase.ActionContext;
        actionContext.params = userCreateParams;
        let createdJob = await createJobAction.run(actionContext);
        return createdJob;
    }
}