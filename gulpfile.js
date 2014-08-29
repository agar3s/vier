var gulp = require('gulp');
var path = 'app/**';
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var size = require('gulp-filesize');
var runsequence = require('run-sequence');
var wait = require('gulp-wait');



gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
  .pipe(clean());
});

gulp.task('move', ['clean'],function(){
  gulp.src('./index.html')
  .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', ['move'],function() {
  gulp.src(['wrapper.txt',
            './app/js/initializers.js',
            './app/js/keyEvents.js',
            './app/js/sprites.js',
            './app/js/sprite.js',
            './app/js/platform.js',
            './app/js/main.js',
            'wrappere.txt'
          ])
    .pipe(concat('a.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('compress',function() {
  gulp.src('./dist/**')
  .pipe(zip('app.zip'))
  .pipe(gulp.dest('./'))
});

gulp.task('report',['compress'], function(){
  gulp.src(['./app.zip'])
  .pipe(size())
});

gulp.task('default', ['scripts']);