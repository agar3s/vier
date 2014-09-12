var heroS = new Sprite(hero, heroAnimations);
heroS.setAnimation('i');


var HeroT = function(sprite){
  var m = this;
  m.sprite = sprite;
  m.sprite.setPixelSize(5);  
  m.incColor = 0;
  m.down = 0;
  m.up = 0;

  m.reset = function(){
    m.del = 0;
    m.sprite.hp = 31;
    m.maxhp = 31;
    m.skills = new ElementalSkill([0,1,2,3],99);
    m.coldown = 16;
    m.currentColor = elementColors[m.skills.current];
    m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
  }
  m.reset();
  m.lock = function(locks){
    for (var i = 0; i < locks.length; i++) {
      m.skills.lock(locks[i]);
    }
  }
  m.nextSkill = function(skill, index){
    if(skill+index>3) skill=index-1;
    else if(skill+index<0) skill=3+index+1;
    else skill+=index;
    if(m.skills.locks[skill]){
      return m.nextSkill(skill, index);
    }
    return skill;
  }
  m.selectSkill = function(index){
    m.skills.current= index;
    m.skills.updateCurrentQ();
    firexx.color = basicColors[m.skills.current];
  }
  m.next = function(){
    m.selectSkill(m.nextSkill(m.skills.current,1));
    m.incColor=5;
    keyMap-=64;
  }
  m.prev = function(){
    m.selectSkill(m.nextSkill(m.skills.current,-1));
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
    if(m.sprite.y>400) m.del = 1;
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

  m.hit = function(type, damage, direction){
    //console.log(type, m.skills.current, damage);
    //damage =getTotalDamage(type, m.skills.current, damage) ;
    //console.log('total damage:', damage);
    var totalDamage = getTotalDamage(type, m.skills.current, damage);
    m.sprite.x+=(direction?1:-1)*totalDamage*10;
    if(m.sprite.x<0)m.sprite.x = 0;
    if(m.sprite.x>xlevel.w-64)m.sprite.x = xlevel.w-64;
    if(heroS.hit(totalDamage)&&!m.del){
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
  m.draw = function(vx, vy){
    with(ctx){
      fillStyle=white;
      fillText('Agtaske', vx+73, vy+20);
      strokeStyle = 'yellow';
      fillStyle = '#300';
      strokeRect (vx+35, vy+35,300,8);
      fillRect (vx+35, vy+35,300,8);
      fillStyle = 'yellow';
      fillRect (vx+35, vy+35, 300*(m.sprite.hp/m.maxhp),8);
      fillText('- '+xlevel.title+' -', vx+dimensions.w/2, vy+35);
    }
    m.skills.draw(vx, vy+dimensions.h);

    if(currentEnemy){
      with(currentEnemy){
        drawAvatar(vx+dimensions.w, vy);
        if(del&&--ghostTime==0) currentEnemy = null;
      }
    }
    m.sprite.drawFace(vx-35, vy+50);
  }
}