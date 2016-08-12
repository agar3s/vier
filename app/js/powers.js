var Power = function(type, pixelSize, damage, x, y, vx, vy){
  var m = this;
  m.type = type;
  m.data = fire;
  //m.data = loadByString(fire);
  m.sprite = new Sprite(m.data);
  m.outside = 0;
  m.color = elementColors[type];
  m.sprite.color =basicColors[type];
  m.sprite.x = x;
  m.sprite.y = y;
  m.sprite.setPixelSize(pixelSize);
  m.sprite.vx = vx;
  m.sprite.vy = vy;
  m.sprite.direction = vx>0;
  m.damage = damage;
  m.del = 0;
  getAudio([type,0.0066,0.1909,0.1663,0.1679,0.5182,,,-0.1129,0.2115,0.6703,-0.7826,-0.1723,0.2605,-0.0009,0.3423,0.0018,-0.4875,0.2872,-0.0083,0.1956,0.7835,-0.4082,0.59])
  
  m.collides = function(){
    for (var i = enemies.length - 1; i >= 0; i--) {
      var sprite = enemies[i].sprite;
      if(intersectRect(sprite.bounds(), m.sprite.bounds())){
        //m.sprite.color = white;
        enemies[i].hit(m.type, m.damage, m.sprite.direction);
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
      myhero.hit(m.type, m.damage, m.sprite.direction);
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
    m.sprite.rotate()
    //if(m.type==1)m.sprite.rotate()
    //if(m.type==2)m.sprite.rotate()
    //if(m.type==3)m.sprite.rotate()
  }
}