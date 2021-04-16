var fs = require('fs');
var DailyRotateFile = require('winston-daily-rotate-file');
var { createLogger, format, transports } = require('winston');

var app = require('../config/config');
const { environment, logging } = app;
const { combine, colorize, splat, printf, timestamp } = format;

const keysToFilter = ['password', 'token'];

const formatter = printf((info) => {
    const { level, message, timestamp: ts, ...restMeta } = info;

    const meta =
        restMeta && Object.keys(restMeta).length
            ? JSON.stringify(restMeta, (key, value) => (keysToFilter.includes(key) ? '******' : value), 2)
            : restMeta instanceof Object
                ? ''
                : restMeta;

    return `[ ${ts} ] - [ ${level} ] ${message} ${meta}`;
});

if (!fs.existsSync(logging.dir)) {
    fs.mkdirSync(logging.dir);
}

let trans = [];

if (environment === 'development') {
    trans = [new transports.Console()];
}

const logger = createLogger({
    level: logging.level,
    format: combine(splat(), colorize(), timestamp(), formatter),
    transports: [
        ...trans,
        new DailyRotateFile({
            maxSize: logging.maxSize,
            maxFiles: logging.maxFiles,
            datePattern: logging.datePattern,
            zippedArchive: true,
            filename: `${logging.dir}/${logging.level}-%DATE%.log`
        })
    ]
});
module.exports = logger;
