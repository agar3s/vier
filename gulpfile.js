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
    .pipe(replace(/drawCharacter/g, 'a'))
    .pipe(replace(/accelerateY/g, 'b'))
    .pipe(replace(/updateX/g, 'c'))
    .pipe(replace(/update/g, 'd'))
    .pipe(replace(/pixelSize/g, 'e'))
    .pipe(replace(/pixelSize/g, 'f'))
    .pipe(replace(/stopX/g, 'g'))
    .pipe(replace(/right/g, 'h'))
    .pipe(replace(/left/g, 'l'))
    .pipe(replace(/accelerationX/g, 'n'))
    .pipe(replace(/setAnimation/g, 'o'))
    .pipe(replace(/landed/g, 'p'))
    .pipe(replace(/coldown/g, 'q'))
    .pipe(replace(/incColor/g, 'r'))
    .pipe(replace(/currentColor/g, 's'))
    .pipe(replace(/currentAnimation/g, 't'))
    .pipe(replace(/rotate/g, 'u'))
    .pipe(replace(/collides/g, 'v'))
    .pipe(replace(/byteArray/g, 'w'))
    .pipe(replace(/canDoubleJump/g, 'z'))
    .pipe(replace(/direction/g, 'aa'))
    .pipe(replace(/frames/g, 'ab'))
    .pipe(replace(/color/g, 'ac'))
    .pipe(replace(/iFrame/g, 'ad'))
    .pipe(replace(/data/g, 'D'))
    .pipe(replace(/sprite/g, 'S'))
    .pipe(replace(/element/g, 'af'))
    .pipe(replace(/draw/g, 'ag'))
    .pipe(replace(/animate/g, 'ah'))
    .pipe(replace(/outside/g, 'ai'))
    .pipe(replace(/manage/g, 'aj'))
    .pipe(replace(/jump/g, 'ak'))
//    .pipe(replace(/down/g, 'DO'))
    .pipe(replace(/prev/g, 'al'))
    .pipe(replace(/next/g, 'am'))
    .pipe(replace(/power/g, 'an'))
    .pipe(replace(/nextAction/g, 'ao'))

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