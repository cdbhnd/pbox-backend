import { Req, Res, Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController, UseBefore } from "routing-controllers";
import * as actions from '../../actions/';
import { HttpError } from '../decorators/httpError';
import { ExceptionTypes } from '../../exceptions';
import { authMiddleware } from '../middleware/authMiddleware';
import {Request, Response} from "express";

@JsonController()
export class BoxController {
    @Get('/v1.0/boxes')
    @UseBefore(authMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async getBoxes(@Req() request: Request, @Param('userId') userId: string) {
        let getBoxesAction = new actions.GetBoxes.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { id: userId };
        actionContext.query = request['parsedQuery'];
        let boxes = await getBoxesAction.run(actionContext);
        return boxes;
    }

    @Get('/v1.0/boxes/:code')
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    async getBox(@Param('code') code: string) {
        let getBoxesAction = new actions.GetBoxByCode.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { boxCode: code };
        return await getBoxesAction.run(actionContext);
    }

    @Post('/v1.0/boxes')
    @UseBefore(authMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createBox(@Param('userId') userId: string, @Body() boxData: any) {
        let getBoxesAction = new actions.CreateBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  boxData;
        actionContext.params.userId = userId;
        let boxes = await getBoxesAction.run(actionContext);
        return boxes;
    }

    @Post('/v1.0/boxes/:code/sensors')
    @UseBefore(authMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createSensor(@Param('userId') userId: string, @Param('code') code: string, @Body() sensorData: any) {
        let getBoxesAction = new actions.CreateBoxSensor.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  sensorData;
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        return await getBoxesAction.run(actionContext);
    }

    @Delete('/v1.0/boxes/:code/sensors/:sensorCode')
    @UseBefore(authMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async deleteSensor(@Param('userId') userId: string, @Param('code') code: string, @Param('sensorCode') sensorCode: string) {
        let getBoxesAction = new actions.RemoveBoxSensor.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  {
            userId: userId,
            boxCode: code,
            sensorCode: sensorCode
        };
        return await getBoxesAction.run(actionContext);
    }

    @Delete('/v1.0/boxes/:code')
    @HttpCode(204)
    @UseBefore(authMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    async deleteBox(@Param('userId') userId: string, @Param('code') code: string) {
        let getBoxesAction = new actions.RemoveBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { boxCode: code, userId: userId };
        await getBoxesAction.run(actionContext);
        return null;
    }

    @Put('/v1.0/boxes/:code')
    @HttpCode(200)
    @UseBefore(authMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    async updateBox(@Param('userId') userId: string, @Param('code') code: string, @Body() boxData: any) {
        let getBoxesAction = new actions.UpdateBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = boxData;
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        let box = await getBoxesAction.run(actionContext);
        return box;
    }

    @Post('/v1.0/boxes/:code/reactivate')
    @HttpCode(200)
    @UseBefore(authMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    async reactivate(@Param('userId') userId: string, @Param('code') code: string) {
        let reactivateBoxAction = new actions.ReactivateBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = {};
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        let box = await reactivateBoxAction.run(actionContext);
        return box;
    }
}
