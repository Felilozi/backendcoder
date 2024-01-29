import winston from 'winston';
import fs from 'fs';

const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
);

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3
};

const colors = {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green'
};

winston.addColors(colors);

const loggerProD = winston.createLogger({
    levels,
    format: logFormat,
    transports: [
        new winston.transports.File({ filename: 'logs/app-prod.log' })
    ]
});
const logTestErrorsPro = () => {
    loggerProD.fatal('This is a test fatal error');
    loggerProD.error('This is a test error');
    loggerProD.warning('This is a test warning');
    loggerProD.info('This is a test info');
    loggerProD.http('This is a test http');
    loggerProD.debug('This is a test debug');
};

export  {loggerProD, logTestErrorsPro };