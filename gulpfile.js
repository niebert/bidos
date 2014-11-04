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

  // gulp.task('angular', function() {
  //   browserify('./src/angular/app.js')
  //     .transform(reactify)
  //     .bundle()
  //     .pipe(source('angular-app.js'))
  //     .pipe(gulp.dest('build/js'));
  // });

  // gulp.task('react', function() {
  //   browserify('./src/react/main.jsx')
  //     .transform(reactify)
  //     .bundle()
  //     .pipe(source('react-components.js'))
  //     .pipe(gulp.dest('build/js'));
  // });

  // gulp.task('copy', function() {
  //   gulp.src('build/js/{react,angular}*.js')
  //     .pipe(plumber({errorHandler:onError}))
  //     .pipe(concat('app.js'))
  //     .pipe(gulp.dest('public/js'));
  // });

  gulp.task('browserify', function() {
    browserify('./src/angular/app.js')
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
    gulp.watch('src/**/*.{js,jsx}', ['browserify']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    // gulp.watch('src/angular/**/*.js', ['angular']);
    // gulp.watch('src/react/**/*.jsx', ['react']);
    // gulp.watch('build/js/**/*.js', ['copy']);
  });

  // gulp.task('build', ['react', 'angular', 'sass']);
  gulp.task('build', ['browserify', 'sass']);
  gulp.task('development', ['build', 'watch', 'serve']);
  gulp.task('default', ['development']);

}());
