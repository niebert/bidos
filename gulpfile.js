(function() {
  'use strict';

  var gulp = require('gulp');
  var chalk = require('chalk');
  var gutil = require('gulp-util');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var merge = require('merge-stream');
  var sass = require('gulp-ruby-sass');
  var flatten = require('gulp-flatten');
  // var connect = require('gulp-connect');
  var traceur = require('gulp-traceur');
  var nodemon = require('gulp-nodemon');
  var browserify = require('browserify');
  var minify = require('gulp-minify-css');
  var prefix = require('gulp-autoprefixer');
  var transform = require('vinyl-transform');
  var sourcemaps = require('gulp-sourcemaps');
  // var livereload = require('gulp-livereload');
  var ngAnnotate = require('gulp-ng-annotate');

  var src = 'app/src';
  var dist = 'app/dist';

  gulp.task('js', js);
  gulp.task('css', css);
  gulp.task('watch', watch);
  gulp.task('templates', templates);
  gulp.task('build', ['css', 'js', 'templates']);

  gulp.task('www', www);
  gulp.task('api', api);

  gulp.task('apk', ['build', 'copyFilesToCordova', 'copyTemplatesToCordova']);
  gulp.task('development', ['build', 'watch', 'api', 'www']);
  gulp.task('production', ['build', 'api']);
  gulp.task('default', ['development']);

  // gulp.task('connect', function() {
  //   connect.server({
  //     root: 'app/dist',
  //     port: 3001,
  //     livereload: true
  //   });
  // });

  gulp.task('version', function() {
    var config = require('./package.json');
    var version = config.name + '-' + config.version;
    console.error(version);
  });

  function js() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(src + '/app.js') // browserify entry point
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(browserified)
      .pipe(ngAnnotate())
      .pipe(traceur())
      .pipe(rename(dist + '/bidos.js'))
      .pipe(gulp.dest('.'))
      .pipe(uglify())
      .pipe(concat(dist + '/bidos.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'));
      // .pipe(livereload());
  }

  function css() {
    return sass(src + '/app.scss') // sass entry point
      .on('error', gutil.log.bind(gutil, 'Sass Error'))
      .on('error', function(err) {
        console.error(err.message);
      })
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(rename('bidos.css'))
      .pipe(gulp.dest(dist))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(minify())
      .pipe(concat('bidos.min.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist));
      // .pipe(livereload());
  }

  function templates() {
    var _templates = gulp.src(src + '/*/**/*.html')
      .pipe(flatten())
      .pipe(gulp.dest(dist + '/templates'));

    var indexHtml = gulp.src(src + '/index.html')
      .pipe(gulp.dest(dist));

    return merge(indexHtml, _templates);
  }

  function watch() {
    // livereload.listen();
    // gulp.watch(src + '/**/*.html', livereload());
    gulp.watch(src + '/**/*.js', ['js']);
    gulp.watch(src + '/app.scss', ['css']);
  }

  function api() {
    nodemon({
        script: 'app/api/index.js',
        watch: ['app/api'],
      })
      .on('change', function() {
        console.log(chalk.red('>> api server restart ') + chalk.white.bold(new Date()));
      });
  }

  function www() {
    nodemon({
        script: 'bin/www_server.js',
        watch: ['app/src', 'bin/www_server.sh'],
      })
      .on('change', function() {
        console.log(chalk.red.bold('>> web front end server restart ') + chalk.white.bold(new Date()));
      });
  }

}());
