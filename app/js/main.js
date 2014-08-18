
data = loadByString(hero);
heroS = new Sprite(data);
for (j = 0; j < heroAnimation.length; j++) {
  var ha = frames[heroAnimation[j]];
  heroS.addFrame(loadByString(ha));
};

heroElementColors=['#0BF','#0A3','#E60','#FE2'];
HeroT = function(spr){
  sprite = spr;
  element = 0;
  chargeColor = function(){
    sprite.setColor(heroElementColors[element]);
  }
  next = function(){
    if(++element>3) element=0;
    chargeColor();
    keyMap-=16;
  }
  prev = function(){
    if(--element<0) element=3;
    keyMap-=64;
    chargeColor();
  }
  return {
    next: next,
    prev: prev,
    manage: function(){
      if(keyMap&16) next();
      if(keyMap&64) prev();
      if(keyMap&1)sprite.left();
      if(keyMap&4)sprite.right();
      if(keyMap&8)sprite.down();
      if(keyMap&2)sprite.up();
      if(keyMap&128)sprite.jump();
    } 
  }
}

data = loadByString(fire);
fireS = new Sprite(data);
fireS.setColor('#E60');

myhero = new HeroT(heroS);

function cleanSpace(){
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,800,600);
}

var platforms = [];
platforms.push(new Platform(12,400,240));
platforms.push(new Platform(600,400,240));
platforms.push(new Platform(320,336,240));
platforms.push(new Platform(120,520,60));
platforms.push(new Platform(150,500,240));

var loop = 0;
function gameLoop() {
  cleanSpace();
  fireS.drawCharacter(3);
  heroS.drawCharacter(6);
  heroS.accelerateY(1);
  heroS.update();
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw();
    platforms[i].collides();
  }

  if(loop%8==0){
    fireS.rotate();
    loop=0;
  }
  myhero.manage();
  if(loop%2==0){
    heroS.animate();
  }
  loop++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);