const config = require('config');
const app = require('./app/server');
const server = require('http').createServer(app);
const logger = require('./app/utils/logger').app;

/**
 * Start up server
 */
const port = config.get('server').port;
server.listen(port);
logger.info(`Server running on port ${port}...`);