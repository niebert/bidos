(function() {
  'use strict';

  var gulp = require('gulp');
  var chalk = require('chalk');
  var uglify = require('gulp-uglify');
  var sass = require('gulp-ruby-sass');
  var concat = require('gulp-concat');
  var nodemon = require('gulp-nodemon');
  var traceur = require('gulp-traceur');
  var rename = require('gulp-rename');
  var browserify = require('browserify');
  var prefix = require('gulp-autoprefixer');
  var transform = require('vinyl-transform');
  var sourcemaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');
  var shell = require('gulp-shell');

  var sourceDir = 'client/';
  var targetDir = 'build/';

  gulp.task('watch', watch);
  gulp.task('serve', serve);
  gulp.task('development', ['watch', 'serve']);
  gulp.task('default', ['development']);

  function manifest() {
    shell.task([
      'manifest.sh'
    ]);
  }

  function scripts() {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });

    return gulp.src(sourceDir + 'app.js') // (['./src/*.js'])
      .pipe(sourcemaps.init())
      .pipe(browserified)
      .pipe(ngAnnotate())
      .pipe(traceur())
      .pipe(rename('bidos.js'))
      .pipe(gulp.dest(targetDir))
      .pipe(uglify())
      .pipe(concat('bidos.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(targetDir));
  }

  function stylesheets() {
    return sass(sourceDir + 'stylesheets/bidos.scss')
      .on('error', function(err) {
        console.error(err.message);
      })
      .pipe(prefix(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(gulp.dest(targetDir));
  }

  function watch() {
    gulp.watch(sourceDir + '/**/*.js', ['scripts']);
    gulp.watch(sourceDir + '/**/*.scss', ['stylesheets']);
  }

  function serve() {
    nodemon({
        script: 'lib/index.js',
        watch: ['lib'],
        env: {
          NODE_ENV: 'development'
        }, // FIXME deprecated -> yargs, minimist
        nodeArgs: ['--harmony'] // FIXME remove?
      })
      .on('change', function() {
        console.log(chalk.red.bold('>> server restart ') + chalk.white.bold(new Date()));
      });
  }

}());
