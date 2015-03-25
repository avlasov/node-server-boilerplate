require('rootpath')();
var express = require('express'),
app = express();

app.use(express.static('public'));

app.get('/users', function(req, res) {
    res.writeHead(200,{'Content-Type': 'application/json'});
    res.write(JSON.stringify({users: ['Peter', 'Paul', 'Mary']}));
    res.end();
});

var server = app.listen(3000, function() {
    var addr = server.address();
    console.log('Listening at http://%s:%s', addr.host, addr.port);
});

module.exports = app;