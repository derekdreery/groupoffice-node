var path = require('path')
  , gulp = require('gulp')
  , spawn = require('child_process').spawn
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
  , stylus = require('gulp-stylus')
  , browserify = require('gulp-browserify')

var EXPRESS_PORT = 3000;
var EXPRESS_ROOT = path.join(__dirname, 'src');
var LIVERELOAD_PORT = 35729;
var paths = {
	server: {
		js_in: './server/src/**/*.js',
		js_and_jade_in: './server/src/**/*.{js,jade}',
		js_out: './server/go.js'
	},
	client: {
		stylus_in: './client/src/stylus/main.styl',
		css_out: './client/style.css',
		app_in: './client/src/js/app.js',
		js_in: './client/src/js/**/*.js',
		js_out: './client/go-client.js'
	}
}

var lr, node;

function devel_server(node) {
	if(node) node.kill();
	node = spawn('node', ['server/src/main.js'], {stdio: 'inherit'});
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

gulp.task('css', function() {
	gulp.src(paths.client.stylus_in)
	    .pipe(stylus({
		    use: ['nib']
	    }))
	    .pipe(gulp.dest(paths.client.css_out))
});

gulp.task('client.js', function() {
	gulp.src(paths.client.app_in)
	    .pipe(browserify({
		    transform: ['jadeify'],
		    extensions: ['.jade']
		  }))
		  .pipe(gulp.dest(paths.client.js_out))
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

gulp.task('develop', ['server.js', 'server.lint', 'client.js', 'client.lint'], function() {
	//client
	gulp.watch(paths.client.stylus, ['css']);
	gulp.watch(paths.client.js_in, ['client.js', 'client.lint']);
	
	gulp.watch([paths.server.js_and_jade_in], ['server.js', 'server.lint']);
});
          

gulp.task('default', function() {
});
