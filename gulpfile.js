var gulp = require('gulp');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');

gulp.task('default', gulpSequence('clean', 'compile', 'copy'));

gulp.task('copy', function (done) {
  return gulp.src(['./**/*.json', './Procfile', './**/*.wsdl', '!./dist/**/*.wsdl'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch([
    './**/*.ts',
    '!./node_modules/**/*.ts',
    '!./typings/**/*.ts'
  ], ['compile']);
});

gulp.task('clean', function () {
  return gulp.src(['!./dist/deploy/', './dist/*'])
    .pipe(clean());
});

gulp.task('compile', function (done) {
  exec('tsc', function (err, stdOut, stdErr) {
    console.log(stdOut);
    if (err) {
      done(err);
    } else {
      done();
    }
  });
});

/** PREPARE HEROKU DEPLOY PACKAGE TASKS **/
gulp.task('deploy', gulpSequence('deploy-clean', 'deploy-copy'));

gulp.task('deploy-clean', function() {
  return gulp.src(['!./dist/deploy/.git/', './dist/deploy/*', ])
    .pipe(clean());
});

gulp.task('deploy-copy', function() {
  return gulp.src(['!./dist/node_modules/', '!./dist/node_modules/**', './dist/**'])
    .pipe(gulp.dest('./dist/deploy'));
});