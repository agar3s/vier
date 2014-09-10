var Power = function(type, pixelSize, x, y, vx, vy){
  var m = this;
  m.type = type;
  if(m.type==0) m.data = fire;
  if(m.type==1) m.data = fire;
  if(m.type==2) m.data = fire;
  if(m.type==3) m.data = fire;
  //m.data = loadByString(fire);
  m.sprite = new Sprite(m.data);
  m.outside = 0;
  m.color = elementColors[type];
  m.sprite.color =basicColors[type];
  m.sprite.x = x;
  m.sprite.y = y;
  m.sprite.setPixelSize(2);
  m.sprite.vx = vx;
  m.sprite.vy = vy;
  m.sprite.direction = vx>0;
  m.damage = 1;
  m.del = 0;
  
  m.collides = function(){
    for (var i = enemies.length - 1; i >= 0; i--) {
      var sprite = enemies[i].sprite;
      if(intersectRect(sprite.bounds(), m.sprite.bounds())){
        //m.sprite.color = white;
        enemies[i].hit(m.type, m.damage);
        m.del = 1;
        createParticles(m.sprite, 2, m.sprite.vx/2, -3, m.color);
        //make me particles
      }
    }
  }

  m.collidesHero = function(bounds){
    //ctx.strokeRect(heroS.xpi(), heroS.y, heroS.xpf()-heroS.xpi() ,heroS.yf()-heroS.yi())
    //ctx.strokeRect(m.sprite.xpi(), m.sprite.y, m.sprite.xpf()-m.sprite.xpi() ,m.sprite.yf()-m.sprite.yi())
    if(intersectRect(bounds, m.sprite.bounds())){
      //m.sprite.color = white;
      //***enemies[i].hit(m.type, m.damage);
      myhero.hit(m.type, m.damage);
      m.del = 1;
      createParticles(m.sprite, 2, m.sprite.vx/2, -3, m.color);
      //make me particles
    }
  }
  
  m.update= function(){
    m.sprite.updateX();
    m.sprite.updateY();
    m.outside = m.sprite.x>xlevel.w || m.sprite.x<-10;
  }
  
  m.animate = function(){
    if(m.type==0)m.sprite.rotate()
    if(m.type==1)m.sprite.rotate()
  }
}