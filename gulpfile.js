(function() {
  'use strict';

   var gulp = require('gulp'),
       util = require('gulp-util'),
       react = require('gulp-react'),
       flatten = require('gulp-flatten'),
       concat = require('gulp-concat'),
       plumber = require('gulp-plumber'),
       uglify = require('gulp-uglify'),
       nodemon = require('gulp-nodemon'),
       reactify = require('reactify'),
       source = require('vinyl-source-stream'),
       browserify = require('browserify'),
       prefix  = require('gulp-autoprefixer'),
       sass = require('gulp-ruby-sass');

  var onError = function(err) {
    util.beep();
    console.log(err);
  };

  gulp.task('browserify', function() {
    browserify('./src/js/app.js')
      .transform(reactify)
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('public/js'));
  });

  gulp.task('sass', function() {
    gulp.src('src/sass/*.scss')
      .pipe(plumber({errorHandler:onError}))
      .pipe(sass({sourcemap:false, style:'compressed'}))
      .pipe(prefix(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('public/css'));
  });

  gulp.task('serve', function() {
    nodemon({
      script: 'index.js',
      watch: ['index.js', 'config'],
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'development' }
    })
    .on('change', []);
  });

  gulp.task('watch', function() {
    gulp.watch('src/**/*', ['browserify']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
  });

  gulp.task('development', ['browserify', 'sass', 'watch', 'serve']);
  gulp.task('default', ['development']);

}());
