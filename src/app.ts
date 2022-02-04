import 'reflect-metadata'; // We need this in order to use @Decorators

import Koa from 'koa';
import Logger from './loaders/logger';
import config from './config';
import loaders from './loaders';

async function startServer() {
    const app = new Koa();

    await loaders({ koaApp: app });

    app.listen(config.port, () => {
        Logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
      `);
    }).on('error', (err) => {
        Logger.error(err);
        process.exit(1);
    });

}

startServer();
