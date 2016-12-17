import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController, UseBefore } from "routing-controllers";
import { CreateJob, ActionBase, GetJobsByUser } from '../../actions/';
import { HttpError } from '../decorators/httpError';
import { ExceptionTypes } from '../../exceptions';
import { authMiddleware } from '../middleware/authMiddleware';

@JsonController()
export class JobsController {

    @Post("/jobs")
    @HttpCode(201)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createJob( @Body() userCreateParams: any) {
        let createJobAction = new CreateJob.Action();
        let actionContext = new ActionBase.ActionContext;
        actionContext.params = userCreateParams;
        let createdJob = await createJobAction.run(actionContext);
        return createdJob;
    }

    @UseBefore(authMiddleware)
    @Get('/jobs')
    @HttpCode(200)
    @HttpError(401, ExceptionTypes.ValidationException)
    async getJobsByUser( @Param('userId') userId: string) {
        let getJobsByUser = new GetJobsByUser.Action();
        let actionContext = new ActionBase.ActionContext;
        actionContext.params =  { id: userId };
        let userJobs = await getJobsByUser.run(actionContext);
        return userJobs;
    }
}
