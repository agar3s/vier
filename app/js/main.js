//@agar3s
var data = loadByString(hero);
var heroS = new Sprite(data);
var powers = [];
heroS.setAnimation('i');


var heroElementColors = [25,115,205,295];
var Power = function(type, pixelSize){
  var m = this;
  m.type = type;
  if(m.type==0) m.data = loadByString(fire);
  if(m.type==1) m.data = loadByString(water);
  //m.data = loadByString(fire);
  m.sprite = new Sprite(m.data);
  m.outside = 0;
  m.sprite.color = heroS.color;
  m.sprite.x = heroS.x+8*3;
  m.sprite.y = heroS.y;
  m.sprite.pixelSize = 2;
  m.sprite.vx = heroS.direction?8:-8;
  m.sprite.direction = heroS.direction;
  m.updateX= function(){
    m.sprite.updateX();
    m.outside = m.sprite.x>1000 || m.sprite.x<-10;
  }
  m.animate = function(){
    if(m.type==0)m.sprite.rotate()
    if(m.type==1)m.sprite.rotate()
  }
}

var HeroT = function(spr){
  var m = this;
  m.sprite = spr;
  m.element = 0;
  m.coldown = 16;
  m.currentColor = heroElementColors[m.element];
  m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
  m.incColor = 0;
  m.next = function(){
    if(++m.element>3) m.element=0;
    m.incColor=5;
    keyMap-=16;
  }
  m.prev = function(){
    if(--m.element<0) m.element=3;
    keyMap-=64;
    m.incColor=-5;
  }
  m.power = function(){
    if(m.coldown<=0){
      m.sprite.setAnimation('p');
      powers.push(new Power(0,2));
      m.coldown = 16;
    }
  }
  m.update = function(){
    m.currentColor+=m.incColor;
    if(m.currentColor<0) m.currentColor=355;
    if(m.currentColor>355) m.currentColor=5;
    if(m.currentColor!=heroElementColors[m.element]){
      m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
    }else{
      m.incColor = 0;
    }
    if(--m.coldown<0) m.coldown=0;
  }
  m.manage= function(){
    if(keyMap&16) m.next();
    if(keyMap&64) m.prev();
    if(keyMap&8) m.sprite.down();
    if(keyMap&2) m.sprite.up();
    if(keyMap&128){
      m.sprite.jump();
      keyMap^=128;
    }
    if(keyMap&32) m.power();
    if(keyMap&1) m.sprite.left();
    else if(keyMap&4) m.sprite.right();
    else m.sprite.stopX();
  }
}

data = loadByString(fire);
var firexx = new Sprite(data);
firexx.color = '#E60';
var myhero = new HeroT(heroS);

function cleanSpace(){
  ctx.fillStyle='#111';
  ctx.fillRect(0,0,800,600);
}

var platforms = [];
platforms.push(new Platform(12,400,240));
platforms.push(new Platform(600,400,240));
platforms.push(new Platform(320,336,240));
platforms.push(new Platform(120,520,60));
platforms.push(new Platform(150,500,240));
firexx.pixelSize = 4;
heroS.pixelSize = 5;

var loop = 0;
var xlevel = new Level();
function gameLoop() {
  cleanSpace();
  firexx.drawCharacter();
  heroS.drawCharacter();
  heroS.accelerateY(0.8);
  heroS.update();
  myhero.update();
  xlevel.drawLevel();
  for(i = 0; i < platforms.length; i++) {
    platforms[i].draw();
    platforms[i].collides();
  }
  for (var j = powers.length - 1; j >= 0; j--) {
    powers[j].updateX();
    powers[j].sprite.drawCharacter();
    if(loop%4==0){
      powers[j].animate();
    }
    if(powers[j].outside){
      powers.splice(j, 1);
    }
  }

  if(loop%8==0){
    firexx.rotate();
    loop=0;
  }
  firexx.updateX();
  myhero.manage();
  if(loop%2==0){
    heroS.animate();
  }
  loop++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);