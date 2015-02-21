(function() {
  'use strict';

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  // var traceur = require('gulp-traceur');
  var browserify = require('browserify');
  var minify = require('gulp-minify-css');
  var prefix = require('gulp-autoprefixer');
  var transform = require('vinyl-transform');
  var sourcemaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');

  var src = 'app/src';
  var dist = 'app/dist';

  gulp.task('js-app', jsApp);
  gulp.task('js-vendor', jsVendor);

  gulp.task('css', css);
  gulp.task('watch', watch);
  gulp.task('js', ['build-js-app', 'build-js-vendor']);
  gulp.task('build', ['css', 'js']);
  gulp.task('apk', ['build', 'copyFilesToCordova', 'copyTemplatesToCordova']);
  gulp.task('development', ['build', 'watch', 'api', 'www']);
  gulp.task('production', ['build', 'api']);
  gulp.task('default', ['development']);

  function watch() {
    gulp.watch(src + '/**/*.js', ['js']);
    gulp.watch(src + '/app.scss', ['css']);
    gulp.watch(src + '/**/*.html', ['templates']);
  }

  function jsApp() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(src + '/app.js') // browserify entry point
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(browserified)
      .pipe(ngAnnotate())
      // .pipe(traceur())
      .pipe(rename(dist + '/bidos.js'))
      .pipe(gulp.dest('.'))
      // .pipe(uglify())
      .pipe(concat(dist + '/bidos.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'));
  }

  function jsVendor() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(src + '/lib.js') // browserify entry point
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(browserified)
      // .pipe(ngAnnotate())
      // .pipe(traceur())
      .pipe(rename(dist + '/vendor.js'))
      .pipe(gulp.dest('.'))
      .pipe(uglify())
      .pipe(concat(dist + '/vendor.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'));
  }

  function css() {
    return sass(src + '/app.scss') // sass entry point
      .on('error', gutil.log.bind(gutil, 'Sass Error'))
      .on('error', function(err) {
        console.error(err.message);
      })
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(rename('bidos.css'))
      .pipe(gulp.dest(dist))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(minify())
      .pipe(concat('bidos.min.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist));
  }
}());
