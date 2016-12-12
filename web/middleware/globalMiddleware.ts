import {MiddlewareGlobalBefore, MiddlewareInterface} from "routing-controllers";

@MiddlewareGlobalBefore()
export class globalMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        global['response_reference'] = response;
        next();
    }

}