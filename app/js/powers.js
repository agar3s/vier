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
  m.sprite.vx = heroS.direction?10:-10;
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