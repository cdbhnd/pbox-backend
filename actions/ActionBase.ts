import { validate } from '../utility/Validator';

export abstract class ActionBase<TOut> {

    protected abstract execute(params?): Promise<TOut>;
    protected abstract getConstraints(): any;

    async run(context?: ActionContext): Promise<TOut> {

        if (typeof(context) === 'undefined') {
            return await this.execute();
        }
        await validate(context.params, this.getConstraints());
        return await this.execute(context);
    }
}

export class ActionContext {
    entityId: number;
    params: any;
}