import * as actions from '../../actions/';
import {ExceptionTypes} from '../../exceptions/';
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore} from 'routing-controllers';
import {authMiddleware} from  '../middleware/authMiddleware';
import * as jwt from 'jwt-simple';
import * as config from 'config';
import * as entities from '../../entities/';
import {HttpError} from '../decorators/httpError';

@JsonController()
export class UserController {

    @Post('/v1.0/users')
    @HttpCode(201)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(400, ExceptionTypes.UsernameNotAvailableException)
    async createUser( @Body() userSubmitedParams: any) {
        let userCreateAction = new actions.CreateUser.Action();
        let actionContext = new actions.ActionContext;
        actionContext.params = userSubmitedParams;
        let createdUser = await userCreateAction.run(actionContext);
        let secret: string = String(config.get('secret'));
        createdUser.token = jwt.encode({ authUserId: createdUser.id}, secret);
        return createdUser;
    }

    @Post('/v1.0/token')
    @HttpCode(200)  
    @HttpError(401, ExceptionTypes.InvalidCredentialsException)
    @HttpError(400, ExceptionTypes.ValidationException)
    async login( @Body() userSubmitedParams: any) {
        let userLoginAction = new actions.LoginUser.Action();
        let actionContext = new actions.ActionContext;
        userSubmitedParams.type = userSubmitedParams.type ? userSubmitedParams.type : 1; 
        actionContext.params = userSubmitedParams;
        let userFromDb = await userLoginAction.run(actionContext);
        let secret: string = String(config.get('secret'));
        userFromDb.token = jwt.encode({ authUserId: userFromDb.id }, secret);
        return userFromDb;
    }
}