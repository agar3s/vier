var heroS = new Sprite(loadByString(hero));
heroS.setAnimation('i');


var HeroT = function(sprite){
  var m = this;
  m.sprite = sprite;
  m.sprite.setPixelSize(5);
  m.element = 2;
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
      powers.push(new Power(m.element,2));
      m.coldown = 16;
    }
  }
  m.update = function(){
    m.sprite.update();
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
    if(keyMap&1&&m.sprite.x>-16) m.sprite.left();
    else if(keyMap&4&&m.sprite.x+16*pixelSize<xlevel.w) m.sprite.right();
    else m.sprite.stopX();
  }
}