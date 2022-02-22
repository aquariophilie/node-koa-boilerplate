import dotenv from 'dotenv';
import fs from 'fs';
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT || '3000', 10),

    /**
     * Database configurations
     */
    databaseURL: process.env.MONGODB_URI || '',
    databaseUser: process.env.MONGODB_USER || '',
    databasePass: process.env.MONGODB_PASS || '',
    databaseName: process.env.MONGODB_NAME || '',
    /**
     * Your jwt configs
     */
    jwtAlgorithm: process.env.JWT_ALGO || 'ES256',
    jwtExpiresIn: process.env.JWT_EXP || '5m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXP || '30d',
    jwtPublicKey: fs.readFileSync(process.env.JWT_PUBLIC || './public.pem'),
    jwtPrivateKey: fs.readFileSync(process.env.JWT_PRIVATE || './private.pem'),
    jwtUnlessPaths: ['/api/auth/signin', '/api/auth/refresh-token', '/', '/api/status'],
    /**
     * Used by winston logger
     */
    logs: { level: process.env.LOG_LEVEL || 'silly' },

    /**
     * API configs
     */
    api: { prefix: '/api' },
    apiKey: process.env.API_KEY || '',
    appVersion: process.env.npm_package_version,

    /**
     *  Public dir
    */
    publicDir: process.env.PUBLIC_DIR || '',
};
