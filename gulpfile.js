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

  var sourceDir = 'client/';
  var targetDir = 'build/';


  gulp.task('bundleJavascript', handleJs);
  gulp.task('compileSass', handleScss);
  gulp.task('watchFiles', watch);
  gulp.task('startServer', serve);
  gulp.task('development', ['bundleJavascript', 'compileSass', 'watchFiles', 'startServer']);
  gulp.task('default', ['development']);


  function onError(err) {
    util.beep();
    console.log(err);
  }


  function handleJs() {
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


  function handleScss() {
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
    gulp.watch(sourceDir + '/**/*.js', ['handleJs']);
    gulp.watch(sourceDir + '/**/*.scss', ['handleScss']);
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
        console.log(chalk.red.bold('>>> server restart ') + chalk.white.bold(new Date()));
      });
  }

}());
