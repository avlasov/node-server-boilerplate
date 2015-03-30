require('rootpath')();
var express = require('express'),
app = express(),
mw = require('./lib/middleware');

app.use(express.static('public'));

mw(app);

app.use(require('./lib/controllers/'));

var server = app.listen(3000, function() {
    var addr = server.address();
    console.log('Listening at http://%s:%s', addr.host, addr.port);
});

module.exports = app;