import { Req, Res, Controller, Param, Body, Get, Post, Put, Delete, HttpCode, JsonController, UseBefore } from "routing-controllers";
import * as actions from "../../actions/";
import { HttpError } from "../decorators/httpError";
import { ExceptionTypes } from "../../infrastructure/exceptions";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { Request, Response } from "express";

@JsonController()
export class WebHookController {

    @Post("/v1.0/webhook/broadcast")
    // @UseBefore(AuthMiddleware)
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    public async broadcastEvent(@Body() body: any) {
        let broadcastEventAction = new actions.BroadcastEvent.Action();
        let actionContext = new actions.ActionContext();
        actionContext.params = {};
        actionContext.params.data = body.data;
        actionContext.params.eventName = body.eventName;
        return await broadcastEventAction.run(actionContext);
    }
}
