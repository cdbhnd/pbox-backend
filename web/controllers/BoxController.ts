import { Req, Res, Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController, UseBefore } from "routing-controllers";
import * as actions from "../../actions/";
import { HttpError } from "../decorators/httpError";
import { ExceptionTypes } from "../../infrastructure/exceptions";
import { AuthMiddleware } from "../middleware/authMiddleware";
import {Request, Response} from "express";

@JsonController()
export class BoxController {
    @Get("/v1.0/boxes")
    @UseBefore(AuthMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    public async getBoxes(@Req() request: Request, @Param("userId") userId: string) {
        let getBoxesAction = new actions.GetBoxes.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { id: userId };
        // tslint:disable-next-line:no-string-literal
        actionContext.query = request["parsedQuery"];
        let boxes = await getBoxesAction.run(actionContext);
        return boxes;
    }

    @Get("/v1.0/boxes/:code")
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async getBox(@Param("code") code: string) {
        let getBoxesAction = new actions.GetBoxByCode.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { boxCode: code };
        return await getBoxesAction.run(actionContext);
    }

    @Post("/v1.0/boxes")
    @UseBefore(AuthMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    public async createBox(@Param("userId") userId: string, @Body() boxData: any) {
        let getBoxesAction = new actions.CreateBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  boxData;
        actionContext.params.userId = userId;
        let boxes = await getBoxesAction.run(actionContext);
        return boxes;
    }

    @Post("/v1.0/boxes/:code/sensors")
    @UseBefore(AuthMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    public async createSensor(@Param("userId") userId: string, @Param("code") code: string, @Body() sensorData: any) {
        let getBoxesAction = new actions.CreateBoxSensor.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  sensorData;
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        return await getBoxesAction.run(actionContext);
    }

    @Delete("/v1.0/boxes/:code/sensors/:sensorCode")
    @UseBefore(AuthMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    public async deleteSensor(@Param("userId") userId: string, @Param("code") code: string, @Param("sensorCode") sensorCode: string) {
        let getBoxesAction = new actions.RemoveBoxSensor.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  {
            userId: userId,
            boxCode: code,
            sensorCode: sensorCode,
        };
        return await getBoxesAction.run(actionContext);
    }

    @Delete("/v1.0/boxes/:code")
    @HttpCode(204)
    @UseBefore(AuthMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async deleteBox(@Param("userId") userId: string, @Param("code") code: string) {
        let getBoxesAction = new actions.RemoveBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { boxCode: code, userId: userId };
        await getBoxesAction.run(actionContext);
        return null;
    }

    @Put("/v1.0/boxes/:code")
    @HttpCode(200)
    @UseBefore(AuthMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async updateBox(@Param("userId") userId: string, @Param("code") code: string, @Body() boxData: any) {
        let getBoxesAction = new actions.UpdateBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = boxData;
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        let box = await getBoxesAction.run(actionContext);
        return box;
    }

    @Post("/v1.0/boxes/:code/reactivate")
    @HttpCode(200)
    @UseBefore(AuthMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async reactivate(@Param("userId") userId: string, @Param("code") code: string) {
        let reactivateBoxAction = new actions.ReactivateBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = {};
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        let box = await reactivateBoxAction.run(actionContext);
        return box;
    }

    @Post("/v1.0/boxes/:code/status")
    @HttpCode(200)
    @UseBefore(AuthMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async setBoxstatus(@Param("userId") userId: string, @Param("code") code: string, @Body() statusData: any) {
        let setBoxstatus = new actions.SetBoxStatus.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = {};
        actionContext.params = statusData;
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        let box = await setBoxstatus.run(actionContext);
        return box;
    }

    @Post("/v1.0/boxes/:code/sync")
    @HttpCode(200)
    @UseBefore(AuthMiddleware)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async syncBox(@Param("userId") userId: string, @Param("code") code: string) {
        let syncBoxAction = new actions.SyncBox.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = {};
        actionContext.params.userId = userId;
        actionContext.params.boxCode = code;
        let box = await syncBoxAction.run(actionContext);
        return box;
    }

    @Get("/v1.0/boxes/:code/status")
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    public async getStatus(@Param("code") code: string) {
        let getBoxesAction = new actions.GetBoxByCode.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params =  { boxCode: code };
        let box = await getBoxesAction.run(actionContext);
        return { status: box.status };
    }
}
