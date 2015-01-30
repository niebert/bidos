(function() {
  'use strict';

  var gulp = require('gulp');
  var chalk = require('chalk');
  var util = require('gulp-util');
  var uglify = require('gulp-uglify');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  var plumber = require('gulp-plumber');
  var nodemon = require('gulp-nodemon');
  var browserify = require('browserify');
  var prefix = require('gulp-autoprefixer');
  var transform = require('vinyl-transform');
  var ngAnnotate = require('gulp-ng-annotate');
  var shell = require('gulp-shell');

  var sourceDir = 'client/';
  var targetDir = 'build/';


  gulp.task('scripts', scripts);
  gulp.task('stylesheets', stylesheets);
  gulp.task('watch', watch);
  gulp.task('serve', serve);
  gulp.task('manifest', manifest);
  gulp.task('development', ['scripts', 'stylesheets', 'manifest', 'watch', 'serve']);
  gulp.task('production', ['scripts', 'stylesheets', 'serve']);
  gulp.task('default', ['development']);


  function onError(err) {
    util.beep();
    console.log(err);
  }

  function manifest() {
    shell.task([
      'manifest.sh'
    ]);
  }

  function scripts() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(sourceDir + 'app.js') // (['./src/*.js'])
      .pipe(browserified)
      .pipe(ngAnnotate())
      .pipe(gulp.dest(targetDir))
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest(targetDir));
  }


  function stylesheets() {
    gulp.src(sourceDir + 'stylesheets/app.scss')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(sass({
        style: 'compressed'
      }))
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(gulp.dest(targetDir));
  }


  function watch() {
    gulp.watch(sourceDir + '/**/*.js', ['scripts']);
    gulp.watch(sourceDir + '/**/*.scss', ['stylesheets']);
  }


  function serve() {
    nodemon({
        script: 'index.js',
        watch: ['index.js', 'server'],
        env: {
          NODE_ENV: 'development'
        }, // FIXME deprecated -> yargs, minimist
        nodeArgs: ['--harmony']
      })
      .on('change', function() {
        console.log(chalk.red.bold('>> server restart ') + chalk.white.bold(new Date()));
      });
  }

}());
