/**
 * Health check GET route
 */

const logger = require('../../utils/logger').app;
const Bluebird = require('bluebird');

logger.info('loading healthcheck route');

const routes = [
    ['GET /api/v1/healthcheck', sendOK],
    ['GET /api/v1/healthcheck-failure', failCheck],
];

module.exports = function (router) {
    try {
        router(routes);
    } catch (err) {
        logger.error(err);
    }
};

function sendOK(req, res) {
    return Bluebird.try(() => {
        return res.sendStatus(200);
    }).catch((err) => {
        logger.error(err);
        return res.sendStatus(500);
    });
}

function failCheck(req, res) {
    return Bluebird.try(() => {
        throw new Error('Route intentionally failing.');
    }).catch((err) => {
        logger.error(err);
        return res.status(500).send('Intentional Error Test');
    });
}
