(function() {
  'use strict';

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  var traceur = require('gulp-traceur');
  var browserify = require('browserify');
  var nodemon = require('gulp-nodemon');
  var minify = require('gulp-minify-css');
  var prefix = require('gulp-autoprefixer');
  var transform = require('vinyl-transform');
  var sourcemaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');
  var shell = require('gulp-shell')

  var src = 'app/src';
  var dist = 'app/dist';

  gulp.task('js-app', jsApp);
  gulp.task('js-vendor', jsVendor);

  gulp.task('css', css);
  gulp.task('watch', watch);
  gulp.task('js', ['js-app', 'js-vendor']);
  gulp.task('build', ['css', 'js']);
  gulp.task('serve', ['serve-api', 'serve-www']);
  gulp.task('apk', ['build', 'copyFilesToCordova', 'copyTemplatesToCordova']);
  gulp.task('development', ['css', 'js', 'serve']);
  gulp.task('production', ['build', 'api']);
  gulp.task('default', ['development']);

  gulp.task('manifest', shell.task([
    'bin/manifest.sh > app/dist/manifest.appcache'
  ]))

  function watch() {
    gulp.watch(src + '/**/*.js', ['js']);
    gulp.watch(src + '/**/*.scss', ['css']);
    gulp.watch(src + '/**/*.html', ['templates']);
    gulp.watch(dist + '/**/*.{js,css,html}', ['manifest']);
  }

  function jsApp() {
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
      .pipe(sourcemaps.write({
        includeContent: false,
        sourceRoot: '.'
      }))
      .pipe(gulp.dest('.'));
  }

  function jsVendor() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(src + '/lib.js') // browserify entry point
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(browserified)
      // .pipe(ngAnnotate())
      // .pipe(traceur())
      .pipe(rename(dist + '/vendor.js'))
      .pipe(gulp.dest('.'))
      .pipe(uglify())
      .pipe(concat(dist + '/vendor.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'));
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
  }

  gulp.task('serve-api', function() {
    nodemon({
        script: 'app/api/index.js',
        watch: ['app/api'],
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development'
        },
        nodeArgs: ['--harmony']
      })
      .on('change', []);
  });

  gulp.task('serve-www', function() {
    nodemon({
        script: 'bin/www_server.js',
        watch: ['bin/www_server.js'],
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development'
        },
        nodeArgs: ['--harmony']
      })
      .on('change', []);
  });

}());
