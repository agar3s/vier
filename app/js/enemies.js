
var Enemy = function(type, sprite){
  var m = this;
  //m.type = type;
  m.sprite = sprite;
  m.color = elementColors[type]
  m.sprite.color = 'hsl('+m.color+',100%, 50%)';
  m.sprite.setAnimation('i');
  m.sprite.setPixelSize(6);
  m.f = 10;
  m.w = 0;
  m.a = 0;
  m.e = 0;
  m.sprite.maxVx = heroS.maxVx*0.9;
  m.sprite.x = 300;
  m.skills = new ElementalSkill([type]); 
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
  m.setActionPipe('ljdw10jdstw10');
  //m.setActionPipe('lf30sw10tjl');
  m.actionIndex = 0;
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
    m.sprite.update();
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
      enemies.push(new Enemy(~~(Math.random()*4), new Sprite(loadByString(hero))));
    }
  }

}