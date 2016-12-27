import { Req, Res, Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController, UseBefore } from "routing-controllers";
import { CreateJob, ActionBase, GetJobsByUser } from '../../actions/';
import { HttpError } from '../decorators/httpError';
import { ExceptionTypes } from '../../exceptions';
import { authMiddleware } from '../middleware/authMiddleware';
import {Request, Response} from "express";

@JsonController()
export class JobsController {

    @Post("/v1.0/jobs")
    @HttpCode(201)
    @UseBefore(authMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createJob( @Param('userId') userId: string, @Body() userCreateParams: any) {
        let createJobAction = new CreateJob.Action();
        let actionContext = new ActionBase.ActionContext;
        actionContext.params = userCreateParams;
        actionContext.params.userId = userId;
        let createdJob = await createJobAction.run(actionContext);
        return createdJob;
    }

    
    @Get('/v1.0/jobs')
    @UseBefore(authMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async getJobsByUser(@Req() request: Request, @Param('userId') userId: string) {
        let getJobsByUser = new GetJobsByUser.Action();
        let actionContext = new ActionBase.ActionContext;
        actionContext.params =  { id: userId };
        actionContext.query = request['parsedQuery'];
        let userJobs = await getJobsByUser.run(actionContext);
        return userJobs;
    }
}
