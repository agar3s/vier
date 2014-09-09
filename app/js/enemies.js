
var Enemy = function(type, sprite){
  var m = this;
  //m.type = type;
  m.sprite = sprite;
  m.color = elementColors[type]
  m.sprite.color = 'hsl('+m.color+',100%, 50%)';
  m.sprite.setAnimation('i');
  m.sprite.setPixelSize(7);
  m.f = 10;
  m.w = 0;
  m.a = 0;
  m.e = 0;
  m.sprite.maxVx = heroS.maxVx*0.9;
  m.sprite.x = 300;
  m.skills = new ElementalSkill([type]);
  m.maxhp = 4;
  m.sprite.hp = 4;
  m.coldown = 16;
  m.ghostTime = 100;
  m.del = 0;
  //action options:
  //f: forward
  //t: change direction
  //j: jump
  //a: main attack
  //b: second attack
  //c: third attack
  //w: wait
  //l: lock until land, do nothing
  //d: move forward until land
  m.actionpipe = '';
  m.setActionPipe = function(actionpipe){
    var newPipe = '';
    for (var i = 0; i < actionpipe.length; i++) {
      var action = actionpipe[i];
      var times = parseInt(actionpipe.substring(i+1,i+4));
      if(!times){
        newPipe+=action;
        continue;
      }
      i+= (''+times).length;
      for (var j = 0; j < times; j++) {
        newPipe+=(action);
      }
    }
    m.actionpipe = newPipe;
  }
  //m.setActionPipe('lajdaw10jdstaw10');
  //m.setActionPipe('lf30sw10tjl');
  m.setActionPipe('lf60sw10tf60sw10ta');
  m.actionIndex = 0;

  m.attack1 = function(){
    if(m.coldown<=0){
      m.sprite.setAnimation('p');
      console.log('xx');
      //var vy = 0;
      //m.skills.power(vy);
      var vx = -(m.sprite.x - heroS.x);
      var vy = -(m.sprite.y - heroS.y);
      var h = Math.sqrt(vx*vx+vy*vy);
      vx/=h;
      vy/=h;
      var power = new Power(m.skills.current, 2, m.sprite.x+8*3, m.sprite.y, 3*vx, 3*vy);

      enemypowers.push(power);
      m.coldown = 16;
      //power.sprite.vy=vy;
      //m.coldown = 16;
    }
  }
  m.actions = {
    f: m.sprite.forward,
    t: m.sprite.turn,
    j: m.sprite.jump,
    m: function(){},
    a: m.attack1,
    b: m.attack2,
    c: m.attack3,
    s: m.sprite.stopX,
    w: function(){},
    l: function(){
      if(!m.sprite.landed)
        m.actionIndex--;
    },
    d: function(){
      if(!m.sprite.landed){
        m.actionIndex--;
        m.sprite.forward();
      }else{
        m.sprite.stopX();
      }
    }
  } 
  //follow the hero
  m.follow = function(){
    if(m.sprite.x<heroS.x){
      m.sprite.right();
    }else{
      m.sprite.left();
    }
  }
  //run away from the hero
  m.away = function(){
    if(m.sprite.x<heroS.x&&m.sprite.x>0){
      m.sprite.left();
    }else if(m.sprite.x>heroS.x&&m.sprite.x+16*m.sprite.pixelSize<xlevel.w){
      m.sprite.right();
    }else{
      m.sprite.stopX();
    }
  }

  //do the next action in the pipe
  m.nextAction = function(){
    var action = m.actionpipe[m.actionIndex];
    m.actions[action]();
    if(++m.actionIndex>=m.actionpipe.length) m.actionIndex = 0;
  }

  m.update = function(){
    //m.follow();
    //m.away();
    m.nextAction();
    //evaluar
//    m.attack();
    m.sprite.update();
    if(--m.coldown<0) m.coldown=0;
  }

  m.hit = function(type, damage){
    //console.log(type, m.skills.current, damage);
    //damage =getTotalDamage(type, m.skills.current, damage) ;
    //console.log('total damage:', damage);
    if(m.sprite.hit(getTotalDamage(type, m.skills.current, damage))&&!m.del){
     // console.log('kill me');
      m.del = 1;
      //make me particles
      createParticles(m.sprite, damage, 0, 0, m.color);
      //create a new element cell to drop out
      enemies.push(new Enemy(~~(Math.random()*4), new Sprite(loadByString(hero))));
      //enemies.push(new Enemy(~~(Math.random()*4), new Sprite(loadByString(hero))));
    }
    currentEnemy = m;
    console.log(1-m.sprite.hp/m.maxhp, m.sprite.hp);
  }

  m.drawAvatar = function(vx, vy){
    ctx.fillStyle=loop%16==0?'#fff':'red';
    ctx.fillRect(vx-335, vy+35, 300,8);
    ctx.fillStyle = '#000';
    ctx.fillRect (vx-334, vy+36, 300*(1-m.sprite.hp/m.maxhp)-2,6);
  }

}