import winston, { Logger } from 'winston';
import 'winston-daily-rotate-file';
import config from '../config';

const transports = [];
if (process.env.NODE_ENV !== 'development') {
    transports.push(
        new winston.transports.Console(),
    );
    transports.push(new winston.transports.DailyRotateFile({
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD_HH-mm',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '1M',
        frequency: '1M',
        dirname: 'logs',
    }));
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
            ),
        }),
    );
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.prettyPrint(),
            ),
            level: 'error',
        }),
    );
}

const LoggerInstance = winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.metadata(),
        winston.format.json(),
    ),
    transports,
});

export default LoggerInstance as Logger;
