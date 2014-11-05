(function() {
  'use strict';

   var gulp = require('gulp'),
       util = require('gulp-util'),
       flatten = require('gulp-flatten'),
       concat = require('gulp-concat'),
       plumber = require('gulp-plumber'),
       nodemon = require('gulp-nodemon'),
       source = require('vinyl-source-stream'),
       react = require('gulp-react'),
       reactify = require('reactify'),
       browserify = require('browserify'),
       uglify = require('gulp-uglify'),
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

  gulp.task('copy', function() {
    gulp.src('src/**/*.js{,x}')
      .pipe(plumber({errorHandler:onError}))
      .pipe(react({harmony:true, noCacheDir:false}))
      .pipe(concat('app.js'))
      .pipe(gulp.dest('public/js'));
  });

  gulp.task('sass', function() {
    gulp.src('src/sass/*.scss')
      .pipe(plumber({errorHandler:onError}))
      .pipe(sass({sourcemap:false, style:'compressed'}))
      .pipe(prefix(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('public/css'));
  });

  gulp.task('watch', function() {
    gulp.watch('src/**/*', ['browserify']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
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

  gulp.task('development', ['browserify', 'sass', 'watch', 'serve']);
  gulp.task('default', ['development']);

}());
