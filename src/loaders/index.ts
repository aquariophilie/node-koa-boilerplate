import Logger from './logger';
import koaLoader from './koa';
import { MongoDBConnection } from './mongo-connection';

export default async ({ koaApp }) => {

    // Check
    if (process.env.NODE_ENV === 'development') {
        Logger.debug(`process.env.SHELL=${process.env.SHELL}`);
        Logger.debug(`process.env.MONGODB_URI=${process.env.MONGODB_URI}`);
        Logger.debug(`process.env.MONGODB_USER=${process.env.MONGODB_USER}`);
        Logger.debug(`process.env.MONGODB_NAME=${process.env.MONGODB_NAME}`);
    }
    // Test databese connection
    await MongoDBConnection.getConnection();
    Logger.info('✌️ DB loaded and connected!');

    Logger.info('✌️ Dependency Injector loaded');

    await koaLoader({ app: koaApp });
    Logger.info('✌️ Koa loaded');
};
