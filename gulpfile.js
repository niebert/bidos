(function() {
  'use strict';

   var gulp = require('gulp'),
       util = require('gulp-util'),
       plumber = require('gulp-plumber'),
       nodemon = require('gulp-nodemon'),
       source = require('vinyl-source-stream'),
       // uglify = require('gulp-uglify'),
       // buffer = require('vinyl-buffer'),
       browserify = require('gulp-browserify'),
       prefix  = require('gulp-autoprefixer'),
       sass = require('gulp-ruby-sass');

  var onError = function(err) {
    util.beep();
    console.log(err);
  };

  var sourceDir = 'client/src';
  var targetDir = 'client/build';

  gulp.task('browserify', function() {
    // Single entry point to browserify
    gulp.src(sourceDir + '/js/app.js')
      .pipe(browserify({
        insertGlobals : true,
        debug : !gulp.env.production
      }))
      .pipe(gulp.dest(targetDir + '/js'));
  });

  gulp.task('sass', function() {
    gulp.src(sourceDir + '/css/*.scss')
      .pipe(plumber({errorHandler:onError}))
      .pipe(sass({sourcemap:false, style:'compressed'}))
      .pipe(prefix(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest(targetDir + '/css'));
  });

  gulp.task('watch', function() {
    gulp.watch(sourceDir + '/**/*.js', ['browserify']);
    gulp.watch(sourceDir + '/css/**/*.scss', ['sass']);
  });

  gulp.task('serve', function() {
    nodemon({
      script: 'index.js',
      watch: ['index.js', 'platform'],
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'development' }
    })
    .on('change', []);
  });

  gulp.task('development', ['browserify', 'sass', 'watch', 'serve']);
  gulp.task('default', ['development']);

}());
