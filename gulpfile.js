(function() {
  'use strict';

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var concat = require('gulp-concat');
  var minify = require('gulp-minify-css');
  var ngAnnotate = require('gulp-ng-annotate');
  var sourcemaps = require('gulp-sourcemaps');
  var prefix = require('gulp-autoprefixer');
  var nodemon = require('gulp-nodemon');
  var flatten = require('gulp-flatten');
  var traceur = require('gulp-traceur');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  var uglify = require('gulp-uglify');
  var shell = require('gulp-shell');

  var brfs = require('brfs');
  var envify = require('envify');
  var watchify = require('watchify');
  var reactify = require('reactify');
  var browserify = require('browserify');

  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');

  var dist = './app/dist';
  var src = './app/src';

  var bundler = watchify(browserify(src, watchify.args)); // src -> index.js

  bundler.on('update', bundle);
  bundler.on('log', gutil.log);
  bundler
    .transform(brfs)
    .transform(envify)
    .transform(reactify);

  function bundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bidos.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(ngAnnotate())
      .pipe(traceur())
      .pipe(gulp.dest('app/dist/'))
      .pipe(uglify())
      .pipe(rename('bidos.min.js'))
      .pipe(sourcemaps.write('./'), {
        includeContent: false
      })
      .pipe(gulp.dest('app/dist/'));
  }

  gulp.task('js', bundle);

  gulp.task('css', function() {
    return sass(src + '/app.scss') // sass entry point
      .on('error', gutil.log.bind(gutil, 'Sass Error'))
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
  });

  gulp.task('api', function() {
    nodemon({
        script: 'app/api/index.js',
        watch: ['app/api/**/*'],
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development'
        },
        nodeArgs: ['--harmony']
      })
      .on('change', []);
  });

  gulp.task('www', function() {
    nodemon({
        script: 'bin/www.js',
        watch: ['bin/www.js'],
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development'
        },
        nodeArgs: ['--harmony']
      })
      .on('change', []);
  });

  gulp.task('watch', function() {
    gulp.watch(src + '/**/*.js', ['js', 'index']);
    gulp.watch(src + '/**/*.scss', ['css']);
    gulp.watch(src + '/**/*.html', ['templates']);
    // gulp.watch(dist + '/**/*.{js,css,html}', ['manifest']);
  });

  gulp.task('templates', shell.task([
    'bin/templates.sh'
  ]));

  gulp.task('manifest', shell.task([
    'bin/manifest.sh > app/dist/manifest.appcache'
  ]));

  gulp.task('icons', shell.task([
    'bin/copy_icons.sh'
  ]));

  gulp.task('index', shell.task([
    'bin/update-index.sh'
  ]));

  // --
  gulp.task('default', ['templates', 'icons', 'css', 'js', 'watch', 'www', 'index']);

}());
