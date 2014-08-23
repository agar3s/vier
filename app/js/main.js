//@agar3s
data = loadByString(hero);
heroS = new Sprite(data);
console.log(heroS);
powers = [];
for (j = 0; j < heroAnimation.length; j++) {
  var ha = frames[heroAnimation[j]];
  heroS.addFrame(loadByString(ha));
};

heroElementColors = ['#0BF','#0A3','#E60','#FE2'];
Power = function(type){
  var data = loadByString(fire);
  var psprite = new Sprite(data);
  var outside = 0;
  psprite.setColor(heroS.getColor());
  psprite.setX(heroS.getX()+8*3);
  psprite.setY(heroS.getY());
  psprite.setVx(heroS.direction()?8:-8);
  psprite.setDirection(heroS.direction());
  //this.psprite.setVy(-16);
//  console.log(this.psprite);
  return {
    sprite: psprite,
    updateX: function(){
      psprite.updateX();
      outside = psprite.getX()>1000 || psprite.getX()<-10;
    },
    isOutside: function(){return outside}
  }
}
HeroT = function(spr){
  sprite = spr;
  element = 0;
  coldown = 16;
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
  power = function(){
    if(coldown<=0){
      powers.push(new Power(0));
      coldown = 16;
    }
  }
  return {
    next: next,
    prev: prev,
    update: function(){
      if(--coldown<0) coldown=0;
    },
    manage: function(){
      if(keyMap&16) next();
      if(keyMap&64) prev();
      if(keyMap&1)sprite.left();
      if(keyMap&4)sprite.right();
      if(keyMap&8)sprite.down();
      if(keyMap&2)sprite.up();
      if(keyMap&128)sprite.jump();
      if(keyMap&32)power();
    } 
  }
}

data = loadByString(fire);
firexx = new Sprite(data);
firexx.setColor('#E60');

myhero = new HeroT(heroS);

function cleanSpace(){
  ctx.fillStyle='#333';
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
  firexx.drawCharacter(3);
  heroS.drawCharacter(6);
  heroS.accelerateY(1);
  heroS.update();
  myhero.update();
  for(i = 0; i < platforms.length; i++) {
    platforms[i].draw();
    platforms[i].collides();
  }
  for (var j = powers.length - 1; j >= 0; j--) {
    //powers[j].sprite.accelerateY(1);
    powers[j].updateX();
    powers[j].sprite.drawCharacter(3);
    if(loop%4==0){
      powers[j].sprite.rotate()
      loop=0;
    }
    if(powers[j].isOutside()){
      powers.splice(j, 1);
    }
  }
//  console.log(powers.length);

  if(loop%8==0){
    firexx.rotate();
  }
  firexx.updateX();
  myhero.manage();
  if(loop%3==0){
    heroS.animate();
  }
  loop++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);