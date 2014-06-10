var Fiber = require('fibers'),
    app_factory = require('./app.js');

Fiber(function() {
	var app = app_factory(),
			port = process.env.port || 3002;
	app.listen(port);
	console.log("Server listening on " + port);
}).run();

