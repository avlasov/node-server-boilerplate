var env = process.env.NODE_ENV || 'development';

module.exports = function(app) {
    if ('development' === env) {
        app.use(require('./logRoute'));
    }
};