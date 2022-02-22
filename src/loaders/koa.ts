import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import jwt from 'koa-jwt';

import Logger from '../loaders/logger';
import config from '../config';
import route from '../api';
import swagger from '../api/swagger';
import errorHandler from '../api/middlewares/error-handler';

export default async ({ app }: { app: Koa }) => {

    app.use(cors({ credentials: true }));

    app.use(errorHandler);
    // Middleware that transforms the raw string of req.body into json
    app.use(koaBody({ jsonLimit: '100mb' }));

    if (process.env.NODE_ENV === 'development') {
        const swaggerRoute = swagger();
        app.use(swaggerRoute.routes()).use(swaggerRoute.allowedMethods());
    }

    const unlessPaths = config.jwtUnlessPaths;
    app.use(jwt({
        secret: config.jwtPublicKey,
        algorithms: [config.jwtAlgorithm],
    }).unless({ path: unlessPaths }));

    // Load API routes
    app.use(route.routes()).use(route.allowedMethods());
    // List API routes
    if (process.env.NODE_ENV === 'development') {
        Logger.debug('#################### ROUTES ####################');
        route.stack.forEach((i) => Logger.debug(i.path));
        Logger.debug('################################################');
    }
};
