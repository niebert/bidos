(function() {
  'use strict';

   var gulp = require('gulp'),
       util = require('gulp-util'),
       plumber = require('gulp-plumber'),
       nodemon = require('gulp-nodemon'),
       source = require('vinyl-source-stream'),
       uglify = require('gulp-uglify'),
       buffer = require('vinyl-buffer'),
       browserify = require('gulp-browserify'),
       prefix  = require('gulp-autoprefixer'),
       ngAnnotate = require('gulp-ng-annotate'),
       rename = require('gulp-rename'),
       savefile = require('gulp-savefile'),
       sass = require('gulp-ruby-sass');

  var onError = function(err) {
    util.beep();
    console.log(err);
  };

  var sourceDir = 'client/src/';
  var targetDir = 'client/build/';

  gulp.task('handleJs', function() {
    gulp.src(sourceDir + 'app.js') // <-- single entry point
    .pipe(browserify({ insertGlobals: true }))
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
      .pipe(prefix(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest(targetDir));
  });

  gulp.task('watch', function() {
    gulp.watch(sourceDir + '/**/*.js', ['handleJs']);
    gulp.watch(sourceDir + '/**/*.scss', ['handleScss']);
  });

  gulp.task('serve', function() {
    nodemon({
      script: 'index.js',
      watch: ['index.js', 'platform'],
      env: { NODE_ENV: 'development' }, // FIXME deprecated -> yargs, minimist
      nodeArgs: ['--harmony']
    })
    .on('change', []);
  });

  gulp.task('development', ['handleJs', 'handleScss', 'watch', 'serve']);
  gulp.task('default', ['development']);

}());
