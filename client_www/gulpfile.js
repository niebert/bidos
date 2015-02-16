(function() {
  'use strict';

  var gulp = require('gulp');
  var browserify = require('browserify');
  var concat = require('gulp-concat');
  var gutil = require('gulp-util');
  var ngAnnotate = require('gulp-ng-annotate');
  var prefix = require('gulp-autoprefixer');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  var shell = require('gulp-shell');
  var sourcemaps = require('gulp-sourcemaps');
  var traceur = require('gulp-traceur');
  var transform = require('vinyl-transform');
  var uglify = require('gulp-uglify');

  // TODO
  var sourceDir = 'src';
  var targetDir = 'dist';
  var appSources = sourceDir + '/**/*.js';
  var appSourceFile = sourceDir + '/app.js';
  var appBuildFile = targetDir + '/bidos.js';
  var stylesheetFile = sourceDir + '/app.scss';

  gulp.task('js', js);
  gulp.task('css', css);
  gulp.task('watch', watch);
  gulp.task('manifest', manifest);
  gulp.task('default', ['js', 'css', 'manifest', 'watch']);

  // FIXME broken!
  function minFile(filename) {
    var a = filename.split('.')
      .splice(1, 0, 'min')
      .join('.');
    console.log(a);
    return a;
    // return filename.split('.')
    //   .splice(1, 0, 'min')
    //   .join('.');
  }

  // FIXME broken!
  function manifest() {
    shell.task(['./bin/manifest.sh ./build']);
  }

  function js() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(appSourceFile)
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(browserified)
      .pipe(ngAnnotate())
      .pipe(traceur())
      .pipe(rename(appBuildFile))
      .pipe(gulp.dest('.'))
      .pipe(uglify())
      .pipe(concat('bidos.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(targetDir));
  }

  function css() {
    return sass(stylesheetFile)
      .on('error', gutil.log.bind(gutil, 'Sass Error'))
      .on('error', function(err) {
        console.error(err.message);
      })
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(rename('bidos.css'))
      .pipe(gulp.dest(targetDir));
  }

  function watch() {
    gulp.watch(appSources, ['js']);
    gulp.watch(stylesheetFile, ['css']);
  }

}());
