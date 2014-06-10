var express = require('express'),
    logger = require('morgan'),
		Future = require('fibers/future'),
    path = require('path'),
		fs = require('fs'),
    root_dir = path.resolve(__dirname, '..', '..'),
		settings = require('../../go-config.json');

/**
 * This function loads static assets from bower. It should be replaced at
 * some point by something neater (especially for production)
 * 
 * @param {array} files [[url, [dir1, dir2...]]... ] Where url is the path to
 * serve on, and dir1, dir2... are the paths to join to get to the file
 * @param {express} app The app to serve the files for
 * @returns {undefined}
 */
function load_bower(files, app) {
	var load_file = function(file) {
		file[1].unshift('bower_components');
		file[1].unshift(root_dir);
		app.get(file[0], function(req, res) {
			res.sendfile(path.join.apply(process, file[1]));
		});
	};
	for(var i=0, l=files.length; i<l; i++) {
		load_file(files[i]);
	}
}

/**
 * This function gets all subdirs in a directory. It is blocking and needs
 * be run in a Fiber (e.g. future)
 * 
 * @param {String} dir The path to the directory to test
 * @returns {array} The array of subdirectories
 */
function getSubDirs(dir) {
	var subDirs = [];	
	var fileNames = Future.wrap(fs.readdir)(dir).wait();
	console.log("Found the following modules", fileNames);

	var stats = [];
	for(var i=0, l=fileNames.length; i<l; i++) {
		stats.push(Future.wrap(fs.stat)(path.join(dir, fileNames[i])));
	}
	Future.wait(stats);

	for(i=0, l=fileNames.length; i<l; i++) {
		var file = stats[i].get();
		if(file.isDirectory()) {
			subDirs.push(fileNames[i]);
		}
	}
	return subDirs;
}

// TODO better way of serving static files? copy all needed files into lib dir and serve static
// note: we do asynchronous loading rather than concatenating
module.exports = function() {
	var app = express(),
			modules,
			module;

	app.set('views', __dirname + '/views'); //TODO remove views
	app.use(logger('dev'));
	app.use('/partials', express.static(path.join(root_dir, 'go', 'client', 'partials'))); //TODO serve with nginnx/equiv
	
	app.get('/', function(req, res){
    res.render('index.jade'); //TODO let's get rid of this and just serve static page
	});

	load_bower([
		['/lib/jquery.js', ['jquery', 'dist', 'jquery.js']],
		['/lib/angular.js', ['angular', 'angular.js']],
		['/lib/angular-route.js', ['angular-route', 'angular-route.js']],
		['/lib/angular-resource.js', ['angular-resource', 'angular-resource.js']],
		['/lib/angular-ui.js', ['angular-ui', 'build', 'angular-ui.js']],
		['/lib/angular-ui.css', ['angular-ui', 'build', 'angular-ui.css']]
	], app);

	app.get('/core/app.js', function(req, res) {
		res.sendfile(path.join(root_dir, 'go', 'client.js'));
	});
	
	app.get('/core/app.css', function(req, res) {
		res.sendfile(path.join(root_dir, 'go', 'style.css'));
	});
	
	// load modules
	console.log("loading modules");
	modules = getSubDirs(path.join(root_dir, 'go', 'modules'));
	for(var i=0, l=modules.length; i<l; i++) {
		module = modules[i];
		app.use('/'+module, require(path.join(root_dir, 'go','modules', module, 'server', 'routes.js')));
	}

	// get db connection
	console.log("Connecting to db");
	
	return app;
};

