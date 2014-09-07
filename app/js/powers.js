var Power = function(type, pixelSize){
  var m = this;
  m.type = type;
  if(m.type==0) m.data = loadByString(fire);
  if(m.type==1) m.data = loadByString(fire);
  if(m.type==2) m.data = loadByString(fire);
  if(m.type==3) m.data = loadByString(fire);
  //m.data = loadByString(fire);
  m.sprite = new Sprite(m.data);
  m.outside = 0;
  m.color = myhero.currentColor;
  m.sprite.color ='hsl('+m.color+',100%, 50%)';
  m.sprite.x = heroS.x+8*3;
  m.sprite.y = heroS.y;
  m.sprite.setPixelSize(2);
  m.sprite.vx = heroS.direction?10:-10;
  m.sprite.direction = heroS.direction;
  m.damage = 1;
  
  m.collides = function(){
    for (var i = enemies.length - 1; i >= 0; i--) {
      var sprite = enemies[i].sprite;
      if((sprite.xpi()>m.sprite.xpi()&&sprite.xpi()<m.sprite.xpf()||
      sprite.xpf()>m.sprite.xpi()&&sprite.xpf()<m.sprite.xpf())&&
      (m.sprite.y>sprite.y&&m.sprite.y<sprite.yf())){
        //m.sprite.color = '#fff';
        enemies[i].hit(m.type, m.damage);
        m.del = 1;
        createParticles(m.sprite, 2, m.sprite.vx/2, -3, m.color);
        //make me particles
      }
    }
  }
  
  m.updateX= function(){
    m.sprite.updateX();
    m.outside = m.sprite.x>xlevel.w || m.sprite.x<-10;
  }
  
  m.animate = function(){
    if(m.type==0)m.sprite.rotate()
    if(m.type==1)m.sprite.rotate()
  }
}