import { Req, Res, Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController, UseBefore } from "routing-controllers";
import * as actions from '../../actions/';
import { HttpError } from '../decorators/httpError';
import { ExceptionTypes } from '../../exceptions';
import { authMiddleware } from '../middleware/authMiddleware';
import {Request, Response} from "express";

import * as Repo from '../../repositories/';
import * as Entities from '../../entities/';
import * as Providers from '../../providers/';
import { Types, kernel } from "../../dependency-injection/";

@JsonController()
export class JobsController {

    @Put('/v1.0/jobs/:jobId')
    @UseBefore(authMiddleware)
    @HttpCode(200)
    @HttpError(401, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(400, ExceptionTypes.ServiceLayerException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    async updateJob( @Param('jobId') jobId: string, @Param('userId') userId: string, @Body() jobUpdateParams: any ) {
        let action = new actions.UpdateJob.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = jobUpdateParams;
        actionContext.params.jobId = jobId;
        actionContext.params.userId = userId;
        let updatedJob = await action.run(actionContext);
        return updatedJob;
    }
    
    @Post('/v1.0/jobs')
    @HttpCode(201)
    @UseBefore(authMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createJob( @Param('userId') userId: string, @Body() userCreateParams: any) {
        let createJobAction = new actions.CreateJob.Action();
        let actionContext = new actions.ActionContext;
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
        let getJobsByUser = new actions.GetJobs.Action();
        let actionContext = new actions.ActionContext;
        actionContext.params =  { id: userId };
        actionContext.query = request['parsedQuery'];
        let userJobs = await getJobsByUser.run(actionContext);
        return userJobs;
    }

    /*@Get('/test')
    async test() 
    {
        let jobRepo: Repo.JobRepository = kernel.get<Repo.JobRepository>(Types.JobRepository);
        let jobs: Entities.Job[] = await jobRepo.findAll();
        let quoteProvider: Providers.IQuotesProvider = kernel.get<Providers.IQuotesProvider>(Types.QuotesProvider);
        let geocodeProvider: Providers.IGeocodeProvider = kernel.get<Providers.IGeocodeProvider>(Types.GeocodeProvider);

        for (let i = 0; i < jobs.length; i++) {

           let gl: Entities.Geolocation = await geocodeProvider.reverse(jobs[i].pickup.latitude, jobs[i].pickup.longitude); 
           
           if (!!gl) {
               jobs[i].pickup.address = gl.address;
           }
           jobRepo.update(jobs[i]);
        }
        return { success: true };
    }*/
}
