import createHttpError from 'http-errors';
import { Context, Next } from 'koa';
import { request, summary, body, tagsAll, responsesAll, security } from 'koa-swagger-decorator';

import container from '../../config/inversify.config';
import { AuthService } from '../../interfaces/services/IAuth';
import { TYPES } from '../../types';

@tagsAll(['auth'])
@responsesAll(
    {
        200: {
            description: 'success',
            schema: {
                type: 'object',
                properties: {
                    accessToken: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
                    },
                    user: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'john.doe@email.com',
                            },
                            password: {
                                type: 'string',
                                example: 'mysecretpassword',
                            },
                            name: {
                                type: 'string',
                                example: 'John Doe',
                            },
                        },
                    },
                },
            },
        },
        400: { description: 'Not valid request' },
        401: { description: 'access denied' },
    },
)
export default class AuthController {

    @request('post', 'auth/signin')
    @summary('sign in the application')
    @body({
        email: {
            type: 'string', required: true, example: 'giulio.cesare@email.com',
        },
        password: {
            type: 'string', required: true, example: 'secretpassword',
        },
    })
    @security([{ ApiKey: [] }])
    static async signin(ctx: Context, next: Next) {
        const { request: { body: requestBody } } = ctx.request.body;
        const authService = container.get<AuthService>(TYPES.AuthService);
        if (!requestBody.email || !requestBody.password) {
            throw createHttpError(400, 'Not valid request');
        }
        try {
            const result = await authService.signIn(requestBody.email, requestBody.password);
            ctx.body = {
                accessToken: result.accessToken, user: result.user,
            };
            ctx.cookies.set('refresh_token', result.refreshToken, {
                httpOnly: true, overwrite: true, maxAge: 30 * 24 * 3600 * 1000,
            });
            next();
        } catch (error) {
            throw createHttpError(401, 'access_denied', error);
        }
    }

    @request('get', 'auth/refresh-token')
    @summary('sign in the application')
    @security([{ ApiKey: [] }])
    static async refreshToken(ctx: Context, next: Next) {
        const refreshToken = ctx.cookies.get('refresh_token');
        const authService = container.get<AuthService>(TYPES.AuthService);
        if (!refreshToken) {
            throw createHttpError(401, 'access_denied');
        }
        try {
            const accessToken = await authService.refreshAccessToken(refreshToken);
            ctx.body = accessToken;
            next();
        } catch (error) {
            throw createHttpError(401, 'access_denied');
        }
    }
}
