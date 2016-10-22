/**
 * Created by avlasov on 10/20/16.
 */

const config = require('config');
const express = require('express');

const logger = require('./utils/logger').app;
const expressWinston = require('express-winston');
const loggerSettings = config.get('logger');

const app = express();

// log routes
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: loggerSettings.middleware.meta,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}"
}));

/**
 * Recursively include all routes
 */
require('./routes/index')(app);

module.exports = app;


