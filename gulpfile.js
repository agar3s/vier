var gulp = require('gulp');
var path = 'app/**';
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var size = require('gulp-filesize');
var runsequence = require('run-sequence');
var wait = require('gulp-wait');

var replace = require('gulp-replace');


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
            './app/js/levels.js',
            './app/js/enemies.js',
            './app/js/main.js',
            'wrappere.txt'
          ])
    .pipe(concat('a.js'))
    .pipe(replace(/drawCharacter/g, 'DC'))
    .pipe(replace(/accelerateY/g, 'AY'))
    .pipe(replace(/updateX/g, 'PX'))
    .pipe(replace(/update/g, 'PD'))
    .pipe(replace(/pixelSize/g, 'PZ'))
    .pipe(replace(/pixelSize/g, 'PZ'))
    .pipe(replace(/stopX/g, 'SX'))
    .pipe(replace(/right/g, 'RI'))
    .pipe(replace(/left/g, 'LE'))
    .pipe(replace(/accelerationX/g, 'AX'))
    .pipe(replace(/setAnimation/g, 'SA'))
    .pipe(replace(/landed/g, 'LA'))
    .pipe(replace(/coldown/g, 'CO'))
    .pipe(replace(/incColor/g, 'IC'))
    .pipe(replace(/currentColor/g, 'CC'))
    .pipe(replace(/currentAnimation/g, 'CA'))
    .pipe(replace(/rotate/g, 'RO'))
    .pipe(replace(/collides/g, 'CO'))
    .pipe(replace(/byteArray/g, 'BA'))
    .pipe(replace(/canDoubleJump/g, 'CJ'))
    .pipe(replace(/direction/g, 'DI'))
    .pipe(replace(/frames/g, 'FR'))
    .pipe(replace(/color/g, 'CR'))
    .pipe(replace(/iFrame/g, 'IF'))
    .pipe(replace(/data/g, 'D'))
    .pipe(replace(/sprite/g, 'S'))
    .pipe(replace(/element/g, 'EL'))

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