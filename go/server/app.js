var express = require('express'),
    path = require('path');


module.exports = function(debug) {
	var app = express();

	app.use(express.logger(debug));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.get('/', function(req, res){
    res.render('index');
	});

	app.get('/app', function(req, res) {
		res.sendfile(path.resolve(path.join(__dirname, '../client.js'))); //TODO find a way to not use ..
	});

	return app;
};

