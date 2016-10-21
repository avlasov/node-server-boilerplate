/**
 * Handle server routes
 */

const fs = require('fs');
const validFileTypes = ['js'];

function insertRoutes(directory, router) {
    fs.readdirSync(directory).forEach(function (fileName) {
        // Recurse if directory
        if (fs.lstatSync(directory + '/' + fileName).isDirectory()) {
            insertRoutes(directory + '/' + fileName, router);
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
            require(directory + '/' + fileName)(router);
        }
    });
}


module.exports = function (app) {

    /**
     * This function is passed DI way to all routes.
     * It's purpose is to dynamically read routes and assign
     * the appropriate handlers to them.
     * @param {Array} routes - routes and their handlers
     * Example (Usage within the route):
     *  const routes = [
     *      ['GET /api/healthcheck', getCheck],
     *      ['POST /api/account/:id/client/:clientid', postClient],
     *  ]
     *  router(routes);
     *
     *  All handlers should return promises to be compatible with the router.
     */

    const router = (routes) => {
        return routes.map((route) => {
            const [routeDefinition, handler] = route;
            if (typeof handler !== 'function') {
                return;
            }
            const [method, path] = routeDefinition.split(' ');
            return app[method.toLowerCase()](path, function (req, res) {
                return handler(req, res);
            });
        });
    }

    insertRoutes(__dirname, router);

    /**
     * Catch 404s
     */
    app.get('*', function (req, res) {
        res.sendStatus(404);
    });
};
