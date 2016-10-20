/**
 * Handle server routes
 */

const fs = require('fs');
const validFileTypes = ['js'];

/**
 * Analyze route path and return camel cased handler name.
 * @param {string} action GET, POST etc
 * @param {string} path api path
 * examples:
 *  getHandler('get', '/api/healthcheck') // returns 'getHealthcheck'
 *  getHandler('get', '/api/period-over-period/weekly') //returns 'getPeriodOverPeriodWeekly'
 */
function getHandler(action, path) {
    return action + path.split('/').map(function (part) {
            if (part.indexOf(':') !== -1) { // ignore route params
                return '';
            }
            return part.split('-').map(function (word) {
                return (word === 'api') ? '' : word.charAt(0).toUpperCase() + word.slice(1);
            }).join('');
        }).join('');
}

function requireFiles(directory, app, router) {
    fs.readdirSync(directory).forEach(function (fileName) {
        // Recurse if directory
        if (fs.lstatSync(directory + '/' + fileName).isDirectory()) {
            requireFiles(directory + '/' + fileName, app, router);
        } else {

            // Skip itself
            if (fileName === 'index.js' && directory === __dirname) {
                return;
            }

            // Skip unknown filetypes
            if (validFileTypes.indexOf(fileName.split('.').pop()) === -1) { // ensure only valid file types are included
                return;
            }

            // Require the file.
            require(directory + '/' + fileName)(app, router);
        }
    });
}


module.exports = function (app) {

    /**
     * This function is passed DI way to all routes.
     * It's purpose is to dynamically read routes and assign
     * the appropriate handlers to them.
     * @param {Object[]} routes - List of routes
     * @param {Object} handlers - map of handlers (handlers are implemented within the route)
     * Example (Usage within the route):
     *  const routes = [
     *      'GET /api/healthcheck',
     *      'POST /api/account/:id/client/:clientid',
     *      'GET /api/healthcheck/helloworld'
     *  ]
     *  var handlers = {
         *    getHealthcheck: getHealthcheck,
         *    postAccountClient: myCustomFunction
         *  };
     *  router(routes, handlers)
     *  Creates following handlers:
     *    app.get('/api/healthcheck', getHealthcheck(req, res) { ... })
     *    app.post('/api/account/:id/client/:clientid', myCustomFunction(req, res) { ... })
     *  Note that 'GET /api/healthcheck/helloworld' will be ignored, since the handler is undefined.
     *  Note that all route parameters, such as :id, will be skipped when creating a handler name.
     *  All handlers should return promises to be compatible with the router.
     */
    const router = function (routes, handlers) {
        routes.map(function (route) {
            const routeConfig = route.split(' ');
            const method = routeConfig[0].toLowerCase();
            const path = routeConfig[1];
            const handler = getHandler(method, path);
            if (typeof handlers[handler] !== 'function') {
                return;
            }
            return app[method](path, function (req, res) {
                return handlers[handler](req, res);
            });
        });
    }

    requireFiles(__dirname, app, router);

    /**
     * Catch 404s
     */
    app.get('*', function (req, res) {
        res.sendStatus(404);
    });
};
