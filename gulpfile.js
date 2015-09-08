var coveralls = require('gulp-coveralls'),
	gulp = require( 'gulp' ),
	jshint = require( 'gulp-jshint' ),
	vui = require( 'vui-helpers' );

gulp.task( 'jshint', function() {
	return gulp.src( ['gulpfile.js', 'scroll-spy.js', 'test/unit/*.js'] )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'default' ) );
} );

gulp.task( 'coverage', function() {
	return gulp.src( 'test/output/coverage/**/lcov.info' )
		.pipe( coveralls() );
} );

gulp.task( 'test', [ 'jshint' ], function () {
	return vui.test( {
		files: [
			'bower_components/jquery/jquery.min.js',
			'bower_components/jquery.ui/ui/jquery.ui.core.js',
			'bower_components//jquery.ui/ui/jquery.ui.widget.js',
			'scroll-spy.js',
			'test/unit/**/*Spec.js'
		],
		preprocessors: {
			'scroll-spy.js': [ 'coverage' ]
		}
	} ) ;
} );
