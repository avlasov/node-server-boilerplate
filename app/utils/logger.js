/**
 * This module creates several loggers, using winston library.
 * Each logger is highly configurable and can be changed according
 * to user's purposes.
 * Usage:
 *      const l1 = require('./this/file').app;  // application logger, writes logs to console and files
 *      const l2 = require('./this/file').debug;  // debug logger, console output only
 *      const l3 = require('./this/file').slack;  // sends logs to slack channel
 *
 *      Then use just like a regular winston logger, e.g. logger.info(myStuff);
 */

const winston = require('winston');
const moment = require('moment').utc;
const config = require('config');
const util = require('util');

const SlackTransport = require('./slack-transport');
const loggerSettings = config.get('logger');
const slackSettings = config.get('slack');
const consoleSettings = loggerSettings.transports.console;
const fileSettings = loggerSettings.transports.file;

const timestamp = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Custom formatter for log strings
 * @param options logger options
 * @returns {string}
 */
const formatter = options => {
    const meta = options.level === 'info' ?
    ' ' + util.inspect(options.meta, false, true) :
        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');

    return timestamp() + ' ' + options.level.toUpperCase()
        + ' ' + (undefined !== options.message ? options.message : '')
        + meta;
};

winston.loggers.add('debug', {
    console: {
        timestamp: consoleSettings.timestamp ? timestamp : false,
        level: consoleSettings.level,
        colorize: consoleSettings.colorize,
        handleExceptions: consoleSettings.handleExceptions,
        humanReadableUnhandledException: consoleSettings.humanReadableUnhandledException,
        formatter: consoleSettings.formatter ? formatter : false
    }
});

winston.loggers.add('application', {
    console: {
        timestamp: consoleSettings.timestamp ? timestamp : false,
        level: consoleSettings.level,
        colorize: consoleSettings.colorize,
        handleExceptions: consoleSettings.handleExceptions,
        humanReadableUnhandledException: consoleSettings.humanReadableUnhandledException,
        formatter: consoleSettings.formatter ? formatter : false
    },
    file: {
        name: 'app-file',
        handleExceptions: fileSettings.handleExceptions,
        humanReadableUnhandledException: fileSettings.humanReadableUnhandledException,
        filename: fileSettings.filePath + '/' + fileSettings.fileName + '.log',
        level: fileSettings.level,
        prettyPrint: true,
        maxsize: fileSettings.maxsize,
        logstash: fileSettings.logstash
    }
});

winston.loggers.add('slack', {
    transports: [
        new (SlackTransport)({
            domain: slackSettings.domain,
            webhook: slackSettings.webhook,
            channel: slackSettings.channel,
            username: slackSettings.username,
            level: 'info',
            icon_emoji: ':ghost:',
        }),
    ]
});


module.exports = {
    app: winston.loggers.get('application'),
    debug: winston.loggers.get('debug'),
    slack: winston.loggers.get('slack'),
};