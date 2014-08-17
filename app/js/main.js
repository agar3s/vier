
data = loadByString(hero);
heroS = new Sprite(data);
for (j = 0; j < heroAnimation.length; j++) {
  var ha = frames[heroAnimation[j]];
  heroS.addFrame(loadByString(ha));
};

heroElementColors=['#0BF','#0A3','#00F','#0F0'];
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

var loop = 0;
function repeatOften() {
  cleanSpace();
  fireS.drawCharacter(3);
  heroS.drawCharacter(6);
  if(loop%7==0){
    fireS.rotate();
  }
  myhero.manage();
  if(loop%2==0){
    heroS.animate();
  }
  loop++;
  requestAnimationFrame(repeatOften);
}

requestAnimationFrame(repeatOften);