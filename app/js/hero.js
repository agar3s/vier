var heroS = new Sprite(hero);
heroS.setAnimation('i');


var HeroT = function(sprite){
  var m = this;
  m.sprite = sprite;
  m.sprite.setPixelSize(5);
  m.skills = new ElementalSkill([0,1,2,3],99);
  m.coldown = 16;
  m.currentColor = elementColors[m.skills.current];
  m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
  m.incColor = 0;
  m.down = 0;
  m.up = 0;
  m.sprite.hp = 31;
  m.maxhp = 31;
  m.del=0;
  m.next = function(){
    if(++m.skills.current>3) m.skills.current=0;
    m.skills.updateCurrentQ();
    firexx.color = basicColors[m.skills.current];
    m.incColor=5;
    keyMap-=64;
  }
  m.prev = function(){
    if(--m.skills.current<0) m.skills.current=3;
    m.skills.updateCurrentQ();
    firexx.color = basicColors[m.skills.current];
    keyMap-=16;
    m.incColor=-5;
  }
  m.power = function(){
    if(m.coldown<=0){
      m.sprite.setAnimation('p');
      var vy = 0;
      if(m.down)vy=7;
      if(m.up)vy=-7;
      m.skills.power(vy, heroS.x+8*3, heroS.y);
      m.coldown = 16;
    }
    m.sprite.color = 'hsl('+m.currentColor+','+m.skills.currentQ+'%, 50%)';
  }
  m.update = function(){
    m.sprite.update();
    m.currentColor+=m.incColor;
    if(m.currentColor<0) m.currentColor=355;
    if(m.currentColor>355) m.currentColor=5;
    if(m.currentColor!=elementColors[m.skills.current]){
      m.sprite.color = 'hsl('+m.currentColor+','+m.skills.currentQ+'%, 50%)';
    }else{
      m.incColor = 0;
    }
    if(--m.coldown<0) m.coldown=0;
  }
  m.manage= function(){
    if(keyMap&64) m.next();
    if(keyMap&16) m.prev();

    m.down=keyMap&8?1:0
    m.up=keyMap&2?1:0
    if(keyMap&128){
      m.sprite.jump();
      keyMap^=128;
    }
    if(keyMap&32) m.power();
    if(keyMap&1&&m.sprite.x>-16) m.sprite.left();
    else if(keyMap&4&&m.sprite.x+16*pixelSize<xlevel.w) m.sprite.right();
    else m.sprite.stopX();
  }

  m.hit = function(type, damage){
    //console.log(type, m.skills.current, damage);
    //damage =getTotalDamage(type, m.skills.current, damage) ;
    //console.log('total damage:', damage);
    if(heroS.hit(getTotalDamage(type, m.skills.current, damage))&&!m.del){
     // console.log('kill me');
      m.del = 1;
      //make me particles
      createParticles(heroS, damage, 0, 0, m.color);
      //create a new element cell to drop out
    }
    //currentEnemy = m;
    //console.log(1-m.sprite.hp/m.maxhp, m.sprite.hp);
  }
  m.charge = function(type, quantity){
    if(type==4){
      m.sprite.hp+=quantity;
      if(m.sprite.hp>m.maxhp)m.sprite.hp=m.maxhp;
    }else{
      m.skills.charges[type]+=quantity;
      if(m.skills.charges[type]>99)m.skills.charges[type]=99;      
    }
  }
  //draw power indicators
  m.draw = function(){
    var vx = -viewport.x;
    var vy = viewport.y;

    ctx.strokeStyle = 'yellow';
    ctx.fillStyle = '#300';
    ctx.strokeRect (vx+35, vy+35,300,8);
    ctx.fillRect (vx+35, vy+35,300,8);
    ctx.fillStyle = 'yellow';
    ctx.fillRect (vx+35, vy+35, 300*(m.sprite.hp/m.maxhp),8);
    m.skills.draw(vx, vy+dimensions.h);

    if(currentEnemy){
      with(currentEnemy){
        drawAvatar(vx+dimensions.w, vy);
        if(del&&--ghostTime==0) currentEnemy = null;
      }
    }
  }
}