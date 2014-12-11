(function() {
  'use strict';

   var gulp = require('gulp'),
       util = require('gulp-util'),
       uglify = require('gulp-uglify'),
       rename = require('gulp-rename'),
       sass = require('gulp-ruby-sass'),
       chalk = require('chalk'),
       plumber = require('gulp-plumber'),
       nodemon = require('gulp-nodemon'),
       browserify = require('browserify'),
       prefix  = require('gulp-autoprefixer'),
       transform = require('vinyl-transform'),
       ngAnnotate = require('gulp-ng-annotate');

  var onError = function(err) {
    util.beep();
    console.log(err);
  };

  var sourceDir = 'client/';
  var targetDir = 'build/';

  gulp.task('handleJs', function () {
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
  });

  gulp.task('handleScss', function() {
    gulp.src(sourceDir + 'stylesheets/app.scss')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(sass({ style: 'compressed' }))
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest(targetDir));
  });

  gulp.task('watch', function() {
    gulp.watch(sourceDir + '/**/*.js', ['handleJs']);
    gulp.watch(sourceDir + '/**/*.scss', ['handleScss']);
  });

  gulp.task('serve', function() {
    nodemon({
      script: 'index.js',
      watch: ['index.js', 'server'],
      env: { NODE_ENV: 'development' }, // FIXME deprecated -> yargs, minimist
      nodeArgs: ['--harmony']
    })
    .on('change', function() { console.log(chalk.red.bold('>>> server restart ') + chalk.white.bold(new Date())); });
  });

  gulp.task('development', ['handleJs', 'handleScss', 'watch', 'serve']);
  gulp.task('default', ['development']);

}());
