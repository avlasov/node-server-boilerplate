/**
 * Created by avlasov on 10/20/16.
 */

const config = require('config');
const express = require('express');

const logger = require('./app/utils/logger').app;
const expressWinston = require('express-winston');
const loggerSettings = config.get('logger');

const app = express();
const server = require('http').createServer(app);

// log routes
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: loggerSettings.middleware.meta,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}"
}));

/**
 * Recursively include all routes
 */
require('./app/routes')(app);


/**
 * Start up server
 */
const port = config.get('server').port
server.listen(port);
logger.info(`Server running on port ${port}...`);
