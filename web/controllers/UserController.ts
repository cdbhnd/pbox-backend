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

    @Post('/users')
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    async createUser( @Body() userSubmitedParams: any) {
        let userCreateAction = new actions.UserCreate.Action();
        let actionContext = new actions.ActionContext;
        actionContext.params = userSubmitedParams;
        console.log(actionContext);
        let createdUser = await userCreateAction.run(actionContext);
        let secret: string = String(config.get('secret'));
        createdUser.token = jwt.encode({ authUserId: createdUser.id}, secret);
        return createdUser;
    }

    @Post('/token')
    @HttpCode(200)  
    @HttpError(401, ExceptionTypes.InvalidCredentialsException)
    async login( @Body() userSubmitedParams: any) {
        let userLoginAction = new actions.UserLogin.Action();
        let actionContext = new actions.ActionContext;
        actionContext.params = userSubmitedParams;
        let userFromDb = await userLoginAction.run(actionContext);
        let secret: string = String(config.get('secret'));
        userFromDb.token = jwt.encode({ authUserId: userFromDb.id }, secret);
        return userFromDb;
    }
}