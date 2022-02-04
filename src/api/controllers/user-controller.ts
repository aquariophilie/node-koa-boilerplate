import createHttpError from 'http-errors';
import { Context, Next } from 'koa';
import { request, summary, body, tagsAll, responses, security, path } from 'koa-swagger-decorator';

import container from '../../config/inversify.config';
import { TYPES } from '../../types';
import { UserService } from '../../interfaces/services/IUser';

const commonResponse = {
    400: { description: 'Not valid request' },
    403: { description: 'Forbidden' },
    401: { description: 'Access denied' },
    404: { description: 'Not found' },
};
const commonPath = {
    id: {
        type: 'string', required: true, description: 'id of the data',
    },
};
const UserSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            minLength: 5,
            example: 'john.doe@email.com',
            required: true,
        },
        password: {
            type: 'string',
            minLength: 4,
            example: 'mysecretpassword',
        },
        name: {
            type: 'string',
            minLength: 4,
            example: 'John Doe',
            required: true,
        },
    },
};
@tagsAll(['user'])
export default class UserController {

    @request('post', 'user')
    @summary('save user')
    @body(Object.assign({ password: { required: true } }, UserSchema.properties))
    @responses({
        ...commonResponse,
        200: {
            description: 'data saved successfully', schema: UserSchema,
        },
    })
    @security([{
        ApiKey: [], BearerAuth: [],
    }])
    static async save(ctx: Context, next: Next) {
        const { request: { body: requestBody } } = ctx.request.body;
        const userService = container.get<UserService>(TYPES.UserService);
        const data = await userService.save(requestBody);
        ctx.body = data || {};
        next();
    }

    @request('put', 'user')
    @summary('update user')
    @body(UserSchema.properties)
    @responses({
        ...commonResponse,
        200: {
            description: 'data updated successfully', schema: UserSchema,
        },
    })
    @security([{
        ApiKey: [], BearerAuth: [],
    }])
    static async update(ctx: Context, next: Next) {
        const { request: { body: requestBody } } = ctx.request.body;
        const userService = container.get<UserService>(TYPES.UserService);
        const { params: { id } } = ctx.params.id;
        if (!id) {
            throw createHttpError(400, 'Missing id');
        }
        const data = await userService.update(id, requestBody);
        ctx.body = data || {};
        next();
    }

    @request('get', 'user')
    @summary('get saved users')
    @responses({
        ...commonResponse,
        200: {
            description: 'array of data',
            schema: {
                type: 'array',
                items: UserSchema,
            },
        },
    })
    @security([{
        ApiKey: [], BearerAuth: [],
    }])
    static async list(ctx: Context, next: Next) {
        const userService = container.get<UserService>(TYPES.UserService);
        const data = await userService.list();
        ctx.body = data || [];
        next();
    }

    @request('get', 'user/{id}')
    @summary('get one user by id')
    @path(commonPath)
    @responses({
        ...commonResponse,
        200: {
            description: 'object of data',
            schema: UserSchema,
        },
    })
    @security([{
        ApiKey: [], BearerAuth: [],
    }])
    static async getOne(ctx: Context, next: Next) {
        const { params: { id } } = ctx.params.id;
        if (!id) {
            throw createHttpError(400, 'Missing id');
        }
        const userService = container.get<UserService>(TYPES.UserService);
        const data = await userService.getOne(id);
        ctx.body = data || null;
        next();
    }

    @request('delete', 'user/{id}')
    @summary('delete one user by id')
    @path(commonPath)
    @responses({
        ...commonResponse,
        200: { description: 'successfully deleted' },
    })
    @security([{
        ApiKey: [], BearerAuth: [],
    }])
    static async delete(ctx: Context, next: Next) {
        const { params: { id } } = ctx.params.id;
        const userService = container.get<UserService>(TYPES.UserService);
        if (!id) {
            throw createHttpError(400, 'Missing id');
        }
        await userService.deleteOne(id);
        ctx.body = '';
        next();
    }

}
