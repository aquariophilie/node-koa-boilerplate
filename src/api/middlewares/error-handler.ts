import { Context, Next } from 'koa';
import Logger from '../../loaders/logger';

export default async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err) {
        Logger.error(err);

        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message || 'Internal server error',
            details: err.details || err,
        };
    }
};
