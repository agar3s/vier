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
            './app/js/elements.js',
            './app/js/particles.js',
            './app/js/sprites.js',
            './app/js/sprite.js',
            './app/js/platform.js',
            './app/js/levels.js',
            './app/js/powers.js',
            './app/js/boosters.js',
            './app/js/enemyBook.js',
            './app/js/enemies.js',
            './app/js/hero.js',
            './app/js/screens.js',
            './app/js/main.js',
            'wrappere.txt'
          ])
    .pipe(concat('a.js'))
    .pipe(replace(/drawCharacter/g, 'a'))
    .pipe(replace(/accelerateY/g, 'b'))
    .pipe(replace(/updateX/g, 'c'))
    .pipe(replace(/updateCurrentQ/g, 'za'))
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
    .pipe(replace(/collidesHero/g, 'v'))
    .pipe(replace(/byteArray/g, 'w'))
    .pipe(replace(/canDoubleJump/g, 'z'))
    .pipe(replace(/direction/g, 'aa'))
    .pipe(replace(/frames/g, 'ab'))
    .pipe(replace(/color/g, 'ac'))
    .pipe(replace(/iFrame/g, 'ad'))
    .pipe(replace(/data/g, 'D'))
    .pipe(replace(/sprite/g, 'S'))
    .pipe(replace(/elementalMatriz/g, 'af'))
    .pipe(replace(/draw/g, 'ag'))
    .pipe(replace(/animate/g, 'ah'))
    .pipe(replace(/outside/g, 'ai'))
    .pipe(replace(/manage/g, 'aj'))
    .pipe(replace(/jump/g, 'ak'))
    .pipe(replace(/nextAction/g, 'ao'))
    .pipe(replace(/next/g, 'am'))
    .pipe(replace(/enemypowers/g, 'an'))
    .pipe(replace(/powers/g, 'ap'))
    .pipe(replace(/particles/g, 'aq'))
    .pipe(replace(/boosters/g, 'ar'))
    .pipe(replace(/loop/g, 'as'))
    .pipe(replace(/viewport/g, 'at'))
    .pipe(replace(/dimensions/g, 'au'))
    .pipe(replace(/zoomFactor/g, 'av'))
    .pipe(replace(/myhero/g, 'aw'))
    .pipe(replace(/currentEnemy/g, 'ax'))
    .pipe(replace(/vendors/g, 'ay'))
    .pipe(replace(/keyMap/g, 'az'))
    .pipe(replace(/keys/g, 'Aa'))
    .pipe(replace(/basicColors/g, 'Ab'))
    .pipe(replace(/createParticles/g, 'Ac'))
    .pipe(replace(/Particle/g, 'Ad'))
    .pipe(replace(/createBooster/g, 'Ae'))
    .pipe(replace(/Booster/g, 'Af'))
    .pipe(replace(/enemies/g, 'Ag'))
    .pipe(replace(/intersectRect/g, 'Ah'))
    .pipe(replace(/getTotalDamage/g, 'Ai'))
    .pipe(replace(/elementColors/g, 'Aj'))
    .pipe(replace(/ElementalSkill/g, 'Ak'))
    .pipe(replace(/gameLoop/g, 'Al'))
    .pipe(replace(/heroS/g, 'Am'))
    .pipe(replace(/platforms/g, 'An'))
    .pipe(replace(/canvas/g, 'Ao'))
    .pipe(replace(/ctx/g, 'Ap'))
    .pipe(replace(/bounds/g, 'Aq'))
    .pipe(replace(/heropower/g, 'Ar'))
    .pipe(replace(/charges/g, 'As'))
    .pipe(replace(/animations/g, 'At'))
    .pipe(replace(/collides/g, 'Av'))
    .pipe(replace(/life/g, 'Aw'))
    .pipe(replace(/lastTime/g, 'Ax'))
    .pipe(replace(/convertTobyte/g, 'Ay'))
    .pipe(replace(/loadByString/g, 'Az'))
    .pipe(replace(/setPixelSize/g, 'AA'))
    .pipe(replace(/addFrame/g, 'AB'))
    .pipe(replace(/fall/g, 'AC'))
    .pipe(replace(/maxVx/g, 'AD'))
    .pipe(replace(/generateLevel/g, 'AE'))
    .pipe(replace(/Platform/g, 'AF'))
    .pipe(replace(/collide/g, 'AG'))
    .pipe(replace(/land/g, 'AH'))
    .pipe(replace(/forward/g, 'AI'))
    .pipe(replace(/bottom/g, 'AJ'))
    .pipe(replace(/Level/g, 'AK'))
    .pipe(replace(/charge/g, 'AL'))
    .pipe(replace(/skills/g, 'AN'))
    .pipe(replace(/maxhp/g, 'AO'))
    .pipe(replace(/quantity/g, 'AP'))
    .pipe(replace(/actionpipe/g, 'AQ'))
    .pipe(replace(/times/g, 'AR'))
    .pipe(replace(/Power/g, 'AS'))
    .pipe(replace(/HeroT/g, 'AT'))
    .pipe(replace(/setActionPipe/g, 'AU'))
    .pipe(replace(/ghostTime/g, 'AV'))
    .pipe(replace(/Enemy/g, 'AW'))
    .pipe(replace(/actionIndex/g, 'AY'))
    .pipe(replace(/booster/g, 'AZ'))
    .pipe(replace(/hit/g, 'ba'))
    .pipe(replace(/follow/g, 'bb'))
    .pipe(replace(/damage/g, 'bc'))
    .pipe(replace(/power/g, 'bd'))
    .pipe(replace(/away/g, 'be'))
//    .pipe(replace(/down/g, 'DO'))
//    .pipe(replace(/prev/g, 'al'))
    //.pipe(replace(/attack/g, 'bf'))
    //.pipe(replace(/type\./g, 'bg.'))
    //.pipe(replace(/current/g, 'bh'))
    //.pipe(replace(/actions/g, 'bi'))
    //.pipe(replace(/downed/g, 'bf'))
    //.pipe(replace(/trigger/g, 'bg'))
    //.pipe(replace(/dCurrentQ/g, 'bh'))
    //.pipe(replace(/agAvatar/g, 'bi'))
    .pipe(replace(/mainLoop/g, 'bj'))
    .pipe(replace(/gameLoop/g, 'bk'))
    .pipe(replace(/introScreen/g, 'bl'))
    .pipe(replace(/pauseScreen/g, 'bm'))
    .pipe(replace(/deadScreen/g, 'bn'))
    .pipe(replace(/currentScreen/g, 'bo'))
    .pipe(replace(/showScreen/g, 'bp'))
    .pipe(replace(/currentQ/g, 'bq'))
    .pipe(replace(/white/g, 'br'))
    .pipe(replace(/black/g, 'bs'))
    .pipe(replace(/monsterNames/g, 'bt'))
    .pipe(replace(/elementNames/g, 'bv'))
    .pipe(replace(/heroAnimations/g, 'bw'))
    .pipe(replace(/monsterAnimations/g, 'bx'))
    .pipe(replace(/monsterSprites/g, 'by'))
    .pipe(replace(/Sprite/g, 'AM'))
    .pipe(replace(/element/g, 'Au'))
    .pipe(replace(/hero/g, 'AX'))

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