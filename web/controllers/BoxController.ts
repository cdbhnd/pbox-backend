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
    async getBoxes(@Param('userId') userId: string) {
        let getBoxesAction = new actions.GetBoxes.Action();
        let actionContext = new actions.ActionContext;
        actionContext.params =  { id: userId };
        let boxes = await getBoxesAction.run(actionContext);
        return boxes;
    }
}
