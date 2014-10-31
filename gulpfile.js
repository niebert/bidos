(function() {
  'use strict';

   var gulp    = require('gulp'),
       util    = require('gulp-util'),
       react   = require('gulp-react'),
       flatten = require('gulp-flatten'),
       concat  = require('gulp-concat'),
       plumber = require('gulp-plumber'),
       nodemon = require('gulp-nodemon'),
       prefix  = require('gulp-autoprefixer'),
       sass    = require('gulp-ruby-sass');

   var browserify = require('browserify'),
       source     = require('vinyl-source-stream');

  var onError = function(err) {
    util.beep();
    console.log(err);
  };

  gulp.task('angular', function() {
    gulp.src('src/angular/**/*.js')
      .pipe(plumber({errorHandler:onError}))
      .pipe(concat('angular-app.js'))
      .pipe(gulp.dest('build'));
  });

  gulp.task('react', function() {
    gulp.src('src/react/**/*.jsx')
      .pipe(plumber({errorHandler:onError}))
      .pipe(react({harmony:true, noCacheDir:false}))
      .pipe(concat('react-components.js'))
      .pipe(gulp.dest('build'));
  });

  gulp.task('compress', ['angular', 'react'], function() {
    gulp.src(['build/*.js'])
      .pipe(plumber({errorHandler:onError}))
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

  gulp.task('server', function() {
    nodemon({
      script: 'index.js',
      debug: true,
      watch: ['index.js', 'config'],
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'development' }
    })
    .on('change', []);
  });

  // gulp.task('tunnel', function() {});

  gulp.task('watch', function() {
    gulp.watch('src/**/*.js{,x}', ['compress']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
  });

  gulp.task('development', ['compress', 'sass', 'server', 'watch']);
  gulp.task('default',     ['development']);

}());
