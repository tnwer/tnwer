const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `\x1b[93m[${timestamp}]\x1b[0m \x1b[94m${level}\x1b[0m: \x1b[91m|\x1b[0m\x1b[96m${message}\x1b[0m\x1b[91m|\x1b[0m`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log', format: combine(timestamp(), logFormat) })
    ]
});

module.exports = logger;
