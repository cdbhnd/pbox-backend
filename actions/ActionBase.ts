import { validate } from '../utility/Validator';
import * as Exceptions from '../exceptions/';
import {sanitize} from '../utility/Sanitizor';

export abstract class ActionBase<TOut> {

    protected abstract execute(params?): Promise<TOut>;
    protected abstract getConstraints(): any;
    protected abstract getSanitizationPattern(): any;

    async run(context?: ActionContext): Promise<TOut> {

        if (typeof(context) === 'undefined') {
            return await this.execute();
        }

        await validate(context.params, this.getConstraints());

        context.params = await sanitize(context.params, this.getSanitizationPattern());

        try 
        {
            context = await this.onActionExecuting(context);
        
            let result = await this.execute(context);

            let resultPrepared = await this.onActionExecuted(result);

            return resultPrepared;
        } catch(e) 
        {
            let errorContext: ErrorContext<TOut> = new ErrorContext<TOut>();
            errorContext.context = context;
            errorContext.exception = e;
            errorContext.handled = false;

            errorContext = await this.onError(errorContext);

            if (errorContext.handled) 
            {
                return errorContext.result;
            }

            throw(e);
        }
    }

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> 
    {
        return context;
    }

    protected async onActionExecuted(result: TOut): Promise<TOut> 
    {
        return result;
    }

    protected async onError(errorContext: ErrorContext<TOut>): Promise<ErrorContext<TOut>>
    {
        return errorContext;
    }
}

export class ActionContext 
{
    entityId: number;
    params: any;
}

export class ErrorContext<T>
{
    context: ActionContext;
    exception: Exceptions.ApplicationException;
    handled: boolean;
    result: T;
}