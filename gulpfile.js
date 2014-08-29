var gulp = require('gulp');
var path = 'app/**';
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var size = require('gulp-filesize');



gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
  .pipe(clean());
});

gulp.task('move', ['clean'],function(){
  gulp.src('./index.html')
  .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', ['move'],function() {
  gulp.src(['./app/js/initializers.js',
            './app/js/keyEvents.js',
            './app/js/sprites.js',
            './app/js/sprite.js',
            './app/js/platform.js',
            './app/js/main.js'
          ])
    .pipe(concat('a.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('compress', ['scripts'],function() {
  gulp.src(['./dist/**'])
  .pipe(size())
});

gulp.task('default', ['compress']);