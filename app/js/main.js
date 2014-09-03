//@agar3s
var data = loadByString(hero);
var heroS = new Sprite(data);
var powers = [];
var platforms = [];
var xlevel = new Level();
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
  m.sprite.vx = heroS.direction?9:-9;
  m.sprite.direction = heroS.direction;
  m.updateX= function(){
    m.sprite.updateX();
    m.outside = m.sprite.x>xlevel.w || m.sprite.x<-10;
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
    if(keyMap&1&&m.sprite.x>-pixelSize) m.sprite.left();
    else if(keyMap&4&&m.sprite.x+16*pixelSize<xlevel.w) m.sprite.right();
    else m.sprite.stopX();
  }
}

data = loadByString(fire);
var firexx = new Sprite(data);
firexx.color = '#E60';
var myhero = new HeroT(heroS);

function cleanSpace(){
  ctx.clearRect(-viewport.x, viewport.y, dimensions.w, dimensions.h);
}

firexx.pixelSize = 4;
heroS.pixelSize = 5;

var loop = 0;

// var boundsv
var xcam = 0; 
var ycam = 0;
//scale
ctx.scale(1, 1);

ctx.translate(viewport.x, -viewport.y);
//ctx.transform(1, 0, 0, 1, 0, 0);
function gameLoop() {
  cleanSpace();
  xlevel.drawLevel();
  xlevel.collides();
  firexx.drawCharacter();
  heroS.accelerateY(0.8);
  heroS.update();
  myhero.update();
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
  heroS.drawCharacter();
  myhero.manage();
  if(loop%2==0){
    heroS.animate();
  }
  loop++;

  if(myhero.sprite.x>300+viewport.x&&myhero.sprite.x-300<xlevel.w-dimensions.w){
    viewport.x-=myhero.sprite.vx;
    xxx=-myhero.sprite.vx;
  }else{
    xxx=0;
  }
  if(viewport.y-viewport.oY<-dimensions.h&&(myhero.sprite.y+viewport.oY+16*pixelSize>viewport.y+dimensions.h&&myhero.sprite.vy>0)||(myhero.sprite.y-viewport.oY<viewport.y&&myhero.sprite.vy<0)){
    viewport.y+=myhero.sprite.vy;
    yyy= -myhero.sprite.vy;
  }else{
    yyy = 0;
  }
  ctx.translate(xxx, yyy);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);