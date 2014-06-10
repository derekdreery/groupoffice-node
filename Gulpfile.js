/**
 * TODO not all stuff plays nice with modules yet (there are none so it's ok :) )
 */

var path = require('path')
  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , spawn = require('child_process').spawn
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
  , stylus = require('gulp-stylus')
  , jade = require('gulp-jade')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace')
  , gutil = require('gulp-util');

var paths = {
	core: {
		server: {
			js: __dirname + '/go/server/**/*.js',
			js_jade: __dirname + '/go/server/**/*.{js,jade}'
		},
		client: {
			stylus: __dirname + '/go/client/stylus/main.styl',
			jade: __dirname + '/go/client/jade/**/*.jade',
			partials: __dirname + '/go/client/partials',
			js: __dirname + '/go/client/js/**/*.js',
			js_jade: [
				__dirname + '/go/client/js/**/*.js',
				__dirname + '/go/client/jade/**/*.jade'
			]
		}
	},
	modules: {
		server: {
			js: __dirname + '/go/modules/*/server/**/*.js',
			js_jade: __dirname + '/go/modules/*/server/**/*.{js,jade}'
		},
		client: {
			stylus: __dirname + '/go/modules/*/client/stylus/main.styl',
			jade: __dirname + '/go/modules/*/client/jade/**/*.jade',
			js: __dirname + '/go/modules/*/client/js/**/*.js',
			js_jade: [
		  	__dirname + '/go/modules/*/client/js/**/*.js',
				__dirname + '/go/modules/*/client/jade/**/*.jade'
			]
		}
	},
	client_js: 'client.js',
	app_css: 'app.css',
	go: __dirname + '/go',
	main_js: __dirname + '/go/server/main.js',
	server_js: 'server.js'
	

};

var lr, node;

/**
 * Kill any running dev server, and then create another
 * 
 * @param {type} node The node server if already running, falsey otherwise
 * @returns {unresolved} The new node server
 */
function devel_server(node) {
	if(node) node.kill();
	node = spawn('node', [paths.main_js], {stdio: 'inherit'});
	node.on('close', function(code) {
		if (code === 8) {
			console.log('Error detected, waiting for changes');
		}
	});
	return node;
}

// Tasks
// =====

/**
 * Generate partials from jade templates
 */
gulp.task('core.partials', function() {
	gulp.src(paths.core.client.jade)
		.pipe(jade({
			pretty: true
		}))
		.pipe(replace(/<!DOCTYPE html>\n/g, ''))
		.on('error', function(err) {
			console.log(err.toString());
			this.emit('end');
		})
		.pipe(gulp.dest(paths.core.client.partials));
});

/**
 * Fire up the dev server
 */
gulp.task('server.js', function() {
	node = devel_server(node);
});

/**
 * Fire up the dev db
 */
gulp.task('mongo', function() {
	var mongo = spawn('mongod', ['--dbpath', __dirname+'/data'], {stdio: 'inherit'});
	mongo.on('close', function(code) {
		console.log("Mongodb closed with error code ", code);
	});
});

/**
 * Compile styl to css
 */
gulp.task('css', function() {
	gulp.src(paths.core.client.stylus)
	    .pipe(stylus({
		    use: ['nib'],
		    paths: ['bower_components/bootstrap-stylus/stylus/']
	    }))
	    .on('error', function() {
				console.log("Error compiling css: waiting for file changes");
				this.emit('end');
	    })
	    .pipe(concat(paths.app_css))
	    .pipe(gulp.dest(paths.go));
});

/**
 * Concat all clientside code
 */
gulp.task('client.js', function() {
	gulp.src([paths.core.client.js, paths.modules.client.js])
		  .pipe(concat(paths.client_js))
		  .pipe(gulp.dest(paths.go));
});

/**
 * Lint the serverside js
 */
gulp.task('server.lint', function() {
	gulp.src([paths.core.server.js, paths.modules.server.js])
	    .pipe(jshint())
	    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Lint the clientside js
 */
gulp.task('client.lint', function() {
	gulp.src([paths.core.client.js, paths.modules.client.js])
	    .pipe(jshint())
	    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Fire up all tasks/watches for development
 */
gulp.task('develop', [
	'server.js', 'server.lint', 'client.js', 'client.lint',
	'css', 'mongo', 'core.partials'
], function() {
	//client
	gulp.watch([paths.core.client.stylus, paths.modules.client.stylus], ['css']);
	gulp.watch([paths.core.client.jade, paths.modules.client.jade], ['core.partials']);
	gulp.watch([paths.core.client.js, paths.modules.client.js], ['client.js', 'client.lint']);
	//server
	gulp.watch([paths.core.server.js_jade, paths.modules.server.js_jade], ['server.js', 'server.lint']);
});
          
/**
 * dummy
 */
gulp.task('default', function() {
});
