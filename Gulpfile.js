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
		js_in: './src/**/*.js',
		js_jade_in: './src/**/*.{js,jade}'
	},
	client: {
		stylus: './client/stylus/main.styl',
		css: './build/public/css',
		app: './client/js/app.js',
		js_in: './client/js/**/*.js',
		js_out: './build/public/js'
	}
}

var lr, node;

function server(node) {
	if(node) node.kill();
	node = spawn('node', ['/server/src/main.js'], {stdio: 'inherit'});
	node.on('close', function(code) {
		if (code === 8) {
			console.log('Error detected, waiting for changes');
		}
	});
	return node;
}

gulp.task('server.js', function() {
	node = server(node);
});

gulp.task('css', function() {
	gulp.src(paths.client.stylus)
	    .pipe(stylus({
		    use: ['nib']
	    }))
	    .pipe(gulp.dest(paths.client.css))
});

gulp.task('client.js', function() {
	gulp.src(paths.client.app)
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
	
	gulp.watch([paths.server.js_jade_in], ['server.js', 'server.lint']);
});
          

gulp.task('default', function() {
});
