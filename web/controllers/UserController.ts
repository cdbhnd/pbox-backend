import {UserLogin, ActionBase} from '../../actions/';
import {ExceptionTypes} from '../../exceptions/';
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore} from 'routing-controllers';
import {authMiddleware} from  '../middleware/authMiddleware';
import * as jwt from 'jwt-simple';
import * as config from 'config';
import {HttpError} from '../decorators/httpError';

@JsonController()
export class UserController {

    @Post('/token')
    @HttpCode(200)  
    @HttpError(401, ExceptionTypes.InvalidCredentialsException)
    async login( @Body() userSubmitedParams: any) {
        let userLoginAction = new UserLogin.Action();
        let actionContext = new ActionBase.ActionContext;
        actionContext.params = userSubmitedParams;
        let userFromDb = await userLoginAction.run(actionContext);
        let secret: string = String(config.get('secret'));
        userFromDb.token = jwt.encode({ authUserId: userFromDb.id }, secret);
        return userFromDb;
    }
}