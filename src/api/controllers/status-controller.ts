import { Context, Next } from 'koa';
import { request, summary, tagsAll, responses } from 'koa-swagger-decorator';

import config from '../../config';

@tagsAll(['status'])
export default class StatusController {

    @request('get', 'status')
    @summary('status of the application')
    @responses({
        200: {
            description: 'status and api version',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    appVersion: { type: 'string' },
                },
            },
        },
    })
    static async status(ctx: Context, next: Next) {
        ctx.body = {
            status: 'online', appVersion: config.appVersion,
        };
        next();
    }
}
