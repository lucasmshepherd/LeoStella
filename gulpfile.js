const gulp = require('gulp');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');

var cssDest = './';

gulp.task('stylus', function(){
	return gulp.src('./src/styl/style.styl')
		.pipe(sourcemaps.init())
    .pipe(stylus())
		//.pipe(changed(cssDest))
    .pipe(postcss([
      require('autoprefixer'), 
      require('postcss-combine-media-query'), 
      require('postcss-combine-duplicated-selectors')
    ]))
		//.pipe(changed(cssDest))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.reload({ stream : true }))
});

var jsFiles = 'src/scripts/**/*.js',
    jsDest = 'dist/js/';

gulp.task('js', function() {
  return gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({ stream : true }))
});

gulp.task('pug', function buildHTML() {
  return gulp.src('**/*.pug')
    .pipe(pug({
      pretty: true // false = minify
    }))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({ stream : true }))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('watch', function(){
	gulp.watch('src/styl/**/*.styl', gulp.series('stylus'));
  gulp.watch('src/scripts/**/*.js', gulp.series('js'));
  gulp.watch('**/*.pug', gulp.series('pug'));
});

gulp.task('default', gulp.parallel('stylus','js','pug','browser-sync','watch'));