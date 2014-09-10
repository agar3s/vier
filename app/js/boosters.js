var Booster = function(type, quantity, x, y){
  var m = this;
  m.type = type;
  m.quantity = quantity;
  m.sprite = new Sprite(booster);
  m.color = elementColors[type];
  m.sprite.color = basicColors[type];
  m.sprite.x = x;
  m.sprite.y = y;
  m.sprite.vy = 0.5;
  m.sprite.landed = 0;
  m.times = 256;
  m.del=0;
  m.update = function(){
    var cond = loop%32==0;
    if(!m.sprite.landed){
      m.sprite.updateY();
    }else{
      m.del=m.times--==0;
      cond = loop%~~(m.times/16)==0; 
    }
    m.sprite.color=cond?'#fff':basicColors[type];
  }
  m.collidesHero = function(bounds){
    if(intersectRect(bounds, m.sprite.bounds())){
      //m.sprite.color = '#fff';
      //***enemies[i].hit(m.type, m.damage);
      myhero.charge(m.type, m.quantity);
      m.del = 1;
      createParticles(m.sprite, 0, 0, -4, m.color);
      //make me particles
    }
  }
}

function createBooster(type, quantity, x, y){
  boosters.push(new Booster(type, quantity, x, y));
}