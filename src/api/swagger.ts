import { SwaggerRouter } from 'koa-swagger-decorator';
import path from 'path';

import config from '../config';

export default (): SwaggerRouter => {
    // init router
    const router = new SwaggerRouter();

    router.prefix(config.api.prefix);
    // load controllers
    router.mapDir(path.resolve(__dirname));

    const options = {
        title: 'API V0.1.0',
        description: 'API DOC',
        version: '0.1.0',
        prefix: `${config.api.prefix}/`,
        swaggerConfiguration: {
            display: {
                deepLinking: true,
                filter: true,
            },
        },
        swaggerOptions: {
            securityDefinitions: {
                BearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
    };
    // dump swagger json
    router.swagger(options);

    router.dumpSwaggerJson({
        filename: 'swagger.json',
        dir: process.cwd(),
    }, options);

    return router;
};
