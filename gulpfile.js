var gulp = require('gulp');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');

gulp.task('default', gulpSequence('clean', 'compile', 'copy'));

gulp.task('copy', function (done) {
  return gulp.src(['./**/*.json', './**/*.wsdl', '!./dist/**/*.wsdl'])
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
  return gulp.src('dist/', { read: false })
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