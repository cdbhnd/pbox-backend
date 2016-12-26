import { validate } from '../utility/Validator';
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
        return await this.execute(context);
    }
}

export class ActionContext {
    entityId: number;
    params: any;
}