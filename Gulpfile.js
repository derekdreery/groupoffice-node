var path = require('path')
  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , spawn = require('child_process').spawn
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
  , stylus = require('gulp-stylus')
  , browserify = require('gulp-browserify')
  , gutil = require('gulp-util')

var paths = {
	server: {
		app_in: __dirname + '/go/server/main.js',
		js_in: [__dirname + '/go/server/**/*.js', __dirname + '/go/modules/*/server/**/*.js'],
		js_and_jade_in: [__dirname + '/go/server/**/*.{js,jade}', __dirname + '/go/modules/*/server/**/*.{js,jade}'],
		js_out: 'server.js'
	},
	client: {
		stylus_in: [__dirname + '/go/client/stylus/main.styl', __dirname + '/go/modules/*/client/stylus/main.styl'],
		css_out: 'style.css',
		app_in: __dirname + '/go/client/js/main.js',
		js_in: [__dirname + '/go/client/js/**/*.js', __dirname + '/go/modules/*/client/js/**/*.js'],
		js_and_jade_in: [__dirname + '/go/client/js/**/*.js',
		                 __dirname + '/go/client/jade/**/*.jade',
		                 __dirname + '/go/modules/*/client/js/**/*.js',
		                 __dirname + '/go/modules/*/client/jade/**/*.jade'],
		js_out: 'client.js'
	},
	go: __dirname + '/go'
}

var lr, node;

function devel_server(node) {
	if(node) node.kill();
	node = spawn('node', [paths.server.app_in], {stdio: 'inherit'});
	node.on('close', function(code) {
		if (code === 8) {
			console.log('Error detected, waiting for changes');
		}
	});
	return node;
}

gulp.task('server.js', function() {
	node = devel_server(node);
});

gulp.task('mongo', function() {
	var mongo = spawn('mongod', ['--dbpath', __dirname+'/data'], {stdio: 'inherit'});
	mongo.on('close', function(code) {
		console.log("Mongodb closed with error code ", code);
	});
});

gulp.task('css', function() {
	gulp.src(paths.client.stylus_in)
	    .pipe(stylus({
		    use: ['nib'],
	    }))
	    .pipe(concat(paths.client.css_out))
	    .pipe(gulp.dest(paths.go))
});

gulp.task('client.js', function() {
	gulp.src(paths.client.app_in)
	    .pipe(browserify({
		    transform: ['jadeify'],
		    extensions: ['.jade']
		  }))
		  .on('error', gutil.log)
		  .pipe(concat(paths.client.js_out))
		  .pipe(gulp.dest(paths.go))
});

gulp.task('server.lint', function() {
	gulp.src(paths.server.js_in)
	    .pipe(jshint())
	    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('client.lint', function() {
	gulp.src(paths.client.js_in)
	    .pipe(jshint())
	    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('develop', ['server.js', 'server.lint', 'client.js', 'client.lint', 'mongo'], function() {
	//client
	gulp.watch(paths.client.stylus_in, ['css']);
	gulp.watch(paths.client.js_and_jade_in, ['client.js', 'client.lint']);
	//server
	gulp.watch(paths.server.js_and_jade_in, ['server.js', 'server.lint']);
});
          

gulp.task('default', function() {
});
