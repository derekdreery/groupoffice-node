/*
 * 
 */
var express = require('express'),
	router = express.Router(),
	User = require('./models/User.js');

router.post('/login', function(req, res) {
	res.send('hello world');
});

module.exports = router;