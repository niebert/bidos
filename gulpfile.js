(function() {
  'use strict';

  var NAME = require('./package.json')
    .name;
  var VERSION = require('./package.json')
    .version;

  var gulp = require('gulp');
  var chalk = require('chalk');
  var gutil = require('gulp-util');
  var shell = require('gulp-shell');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  var traceur = require('gulp-traceur');
  var nodemon = require('gulp-nodemon');
  var browserify = require('browserify');
  var prefix = require('gulp-autoprefixer');
  var transform = require('vinyl-transform');
  var sourcemaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');

  var appDir = 'app';
  var cordovaDir = appDir + '/apk/www';
  var sourceDir = appDir + '/src';
  var sources = sourceDir + '/**/*.js';
  var templates = sourceDir + '/**/*.html';
  var appIndex = sourceDir + '/app.js';
  var appStylesheet = sourceDir + '/app.scss';
  var targetDir = appDir + '/dist';
  var appBuild = targetDir + '/bidos.js';
  var appBuildMin = targetDir + '/bidos.min.js';
  var apkFile = 'app/apk/platforms/android/ant-build/CordovaApp-debug.apk'
  var APKFILE = NAME + '-' + VERSION + '.apk';
  var apiServerFile = 'app/api/index.js';

  gulp.task('js', js);
  gulp.task('css', css);
  gulp.task('watch', watch);
  gulp.task('manifest', manifest);
  gulp.task('copyTemplatesToCordova', copyTemplatesToCordova);
  gulp.task('copyFilesToCordova', copyFilesToCordova);
  gulp.task('runFrontendServer', runFrontendServer);
  gulp.task('copyApkToDist', copyApkToDist);
  gulp.task('runApiServer', runApiServer);

  gulp.task('build', ['css', 'js', 'manifest']);
  gulp.task('apk', ['build', 'copyFilesToCordova', 'copyTemplatesToCordova']);
  gulp.task('development', ['build', 'watch', 'runApiServer', 'runFrontendServer']);
  gulp.task('production', ['build', 'runApiServer']);
  gulp.task('default', ['development']);

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

    // FIXME broken
    var minFilename = function(filename) {
      var a = filename.split('.')
        .splice(1, 0, 'min')
        .join('.');
      console.log(a);
      return a;
      // return filename.split('.')
      //   .splice(1, 0, 'min')
      //   .join('.');
    }

    return gulp.src(appIndex)
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({
        loadMaps: true // loads map from browserify file
      }))
      .pipe(browserified)
      .pipe(ngAnnotate())
      .pipe(traceur())
      .pipe(rename(appBuild))
      .pipe(gulp.dest('.'))
      .pipe(uglify())
      .pipe(concat(appBuildMin))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'));
  }

  function css() {
    return sass(appStylesheet)
      .on('error', gutil.log.bind(gutil, 'Sass Error'))
      .on('error', function(err) {
        console.error(err.message);
      })
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(rename('bidos.css'))
      .pipe(gulp.dest(targetDir));
  }

  // FIXME broken
  function manifest() {
    shell.task(['./bin/manifest.sh ./build']);
  }

  // copy files from dist to apk/www
  function copyFilesToCordova() {
    return gulp.src(targetDir + '/*')
      .pipe(gulp.dest(cordovaDir));
  }

  // copy html templates from dist to apk/www/templates (flattened)
  function copyTemplatesToCordova() {
    return gulp.src(templates)
      .pipe(gulp.dest(cordovaDir));
  }

  // copy html templates from dist to apk/www/templates (flattened)
  function copyApkToDist() {
    return gulp.src(apkFile)
      .pipe(rename(APKFILE))
      .pipe(gulp.dest(targetDir));
  }

  function watch() {
    gulp.watch(sources, ['js']);
    gulp.watch(appStylesheet, ['css']);
    gulp.watch(sourceDir + '/**/*.js', ['serverScripts']);
  }

  function runApiServer() {
    nodemon({
        script: apiServerFile,
        watch: ['lib'],
        env: {
          NODE_ENV: 'development'
        },
        nodeArgs: ['--harmony']
      })
      .on('change', function() {
        console.log(chalk.red('>> api server restart ') + chalk.white.bold(new Date()));
      });
  }

  function runFrontendServer() {
    nodemon({
        script: 'bin/www_server.js',
        watch: ['src'],
        env: {
          NODE_ENV: 'development'
        },
        nodeArgs: ['--harmony']
      })
      .on('change', function() {
        console.log(chalk.red.bold('>> web front end server restart ') + chalk.white.bold(new Date()));
      });
  }

}());
