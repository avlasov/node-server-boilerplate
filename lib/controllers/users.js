var express = require('express'),
router = express.Router();

router.get('/', function(req, res) {
    res.writeHead(200,{'Content-Type': 'application/json'});
    res.write(JSON.stringify({users: ['Peter', 'Paul', 'Mary']}));
    res.end();
});

module.exports = router;