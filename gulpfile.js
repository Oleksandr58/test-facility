var				gulp    	= require('gulp'),
				scss        = require('gulp-sass'),
				browserSync = require('browser-sync'),
				uglify      = require('gulp-uglifyjs'),
				concat      = require('gulp-concat'),
				cssnano     = require('gulp-cssnano'),
				rename      = require('gulp-rename'),
				del         = require('del'),
				imagemin    = require('gulp-imagemin'),
				pngquant    = require('imagemin-pngquant'),
				autoprefixer= require('gulp-autoprefixer'),
				svgSprite = require('gulp-svg-sprite');
				cheerio = require('gulp-cheerio'),
				replace = require('gulp-replace'),
				nunjucks 			= require('gulp-nunjucks');
				

			
var config = {
	shape: {
		dimension: {         // Set maximum dimensions
			maxWidth: 500,
			maxHeight: 500
		},
		spacing: {         // Add padding
			padding: 0
		}
	},
	mode: {
		symbol: {
			dest : '.'
		}
	}
};
				
gulp.task('svg-sprite', function (cb) {
	return gulp.src('app/img/svg/*.svg')
		.pipe(svgSprite(config))	
		.pipe(cheerio({
			run: function($, file) {
				$('[fill]:not([fill="currentColor"])').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(rename({ basename: 'sprite' }))
		.pipe(gulp.dest('app/img'))
});		

gulp.task('nunjucks', function () {
	return gulp.src('app/templates/index.html')
		.pipe(nunjucks.compile())
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({ stream: true }))
});			

gulp.task('scss', function() {
	return gulp.src('app/scss/main.scss')
	.pipe(scss().on( 'error', function( error )
      {console.log( error );} )
	)
	.pipe(autoprefixer(['last 4 versions'], {cascade:true}))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'})) 
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src('app/js/layout/*.js')
					.pipe(concat('scripts.min.js')) 
					.pipe(uglify()) 
					.pipe(gulp.dest('app/js'))
					.pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('img', function(){
	return gulp.src('app/img/raster/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'nunjucks', 'scss', 'js'], function() {
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/templates/*.html', ['nunjucks']);
	gulp.watch('app/js/layout/*.js', ['js']);
});

gulp.task('build', ['clean', 'nunjucks', 'scss', 'img', 'js'], function() {
	var buildIndex = gulp.src('app/index.html')
	.pipe(gulp.dest('dist'));
	
	var buildCss = gulp.src([
		'app/css/main.min.css',
		])
	.pipe(gulp.dest('dist/css'));

	var buildImg = gulp.src('app/img/*.jpg')
	.pipe(gulp.dest('dist/img'));

	var buildJSON = gulp.src('app/json/*.json')
	.pipe(gulp.dest('dist/json'));
	
	var buildJS = gulp.src('app/js/scripts.min.js' )
	.pipe(gulp.dest('dist/js'));
	
	var buildSvgSprite = gulp.src('app/img/svg/sprite.svg')
	.pipe(gulp.dest('dist/img/svg'));
});


// Default Task
gulp.task('default', ['watch']);