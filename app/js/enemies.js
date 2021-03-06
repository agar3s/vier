var monsterNames=['Minion', 'Elemental', 'Monster', 'Wizard', 'Master', 'Grand Master', 'Gran Elemental'];

var Enemy = function(nameCode, type, x, vx, actionpipe, hp, pixelSize, coldown, triggerType){
  var m = this;
  //m.type = type;
  m.name = elementalNames[type]+' '+monsterNames[nameCode];
  m.damage = parseInt(nameCode)+1;
  m.color = elementColors[type];
  //load sprite depending on nameCode and type
  m.monsterCode = elementalNames[type][0]+nameCode;
  m.sprite = new Sprite(monsterSprites[m.monsterCode], monsterAnimations[m.monsterCode]);
  m.sprite.color = 'hsl('+m.color+',100%, 50%)';
  m.sprite.setAnimation('i');
  m.sprite.setPixelSize(pixelSize);

  m.sprite.maxVx = vx||m.pixelSize*2.2;
  m.sprite.x = x;
  m.sprite.y = -720;
  m.skills = new ElementalSkill([type]);
  m.maxhp = hp;
  m.sprite.hp = hp;
  m.coldown = coldown;
  m.maxColdown = coldown;
  m.triggerType = triggerType||2;
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
  //g: go for the hero
  //r: run away from the hero
  //h: fly
  //u: up
  //n: down
  //k: diagonal
  //m: transversal
  //x: restore gravity
  //z: change element
  
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
  m.setActionPipe(actionpipe||'f60taw20');
  //m.setActionPipe('lf30sw10tjl');
  //m.setActionPipe('lf60sw10tf60sw10ta');
  m.actionIndex = 0;

  m.attack1 = function(){
    if(m.coldown<=0){
      m.sprite.setAnimation('p');
      //var vy = 0;
      //m.skills.power(vy);
      var vx = -(m.sprite.x - heroS.x);
      var vy = -(m.sprite.y - heroS.y);
      var h = Math.sqrt(vx*vx+vy*vy);
      vx/=h;
      vy/=h;
      var power = new Power(m.skills.current, m.sprite.pixelSize/3, m.damage, m.sprite.x+8*3, m.sprite.y, 3*vx, 3*vy);

      enemypowers.push(power);
      m.coldown = m.maxColdown;
      //power.sprite.vy=vy;
      //m.coldown = 16;
    }
  }
  //follow the hero
  m.follow = function(){
    m.sprite.direction = m.sprite.x<heroS.x;
    m.sprite.forward();
  }
  //run away from the hero
  m.away = function(){
    m.sprite.direction = m.sprite.x>heroS.x;
    m.sprite.forward();
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
    },
    g: m.follow,
    r: m.away,
    h: function(){
      m.sprite.fall =function(){};
    },
    x: function(){
      m.sprite.fall =function(){
        m.sprite.y += m.sprite.vy;
        if(m.sprite.vy<0){
          m.sprite.landed = 0;
        }
      }
    },
    u: function(){
      m.sprite.y-=3;
    },
    n: function(){
      m.sprite.y+=3;
    },
    k: function(){
      m.actions.u();
      m.sprite.forward();
    },
    m: function(){
      m.actions.n();
      m.sprite.forward();
    },
    z: function(){
      m.skills.nextElement();
      console.log('nx', m.skills.current);
      m.color = elementColors[m.skills.current];
      m.sprite.color = 'hsl('+m.color+',100%, 50%)';      
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
    if(m.sprite.y>400) m.del = 1;
  }

  //triggers coded in an array
  // m.trigger[0] = create energy booster
  // m.trigger[1] = create health booster
  // m.trigger[2] = create random booster 1/10 to drop life
  // m.trigger[3] = hummm
  m.triggers = [
    function(){
      createBooster(m.skills.current, m.maxhp,m.sprite.x, m.sprite.y);
    },
    function(){
      createBooster(4, m.maxhp, m.sprite.x, m.sprite.y);
    },
    function(){
      if(~~(Math.random()*10)==0)
        m.triggers[1]();
      else
        m.triggers[0]();
    },
    function(){
      console.log('otra cosa')
    }
  ];
  m.trigger = function(event){
    m.triggers[m.triggerType]();
  }

  m.hit = function(type, damage, direction){
    //damage =getTotalDamage(type, m.skills.current, damage) ;
    var totalDamage = getTotalDamage(type, m.skills.current, damage);
    m.sprite.x+=(direction?1:-1)*totalDamage*(10-m.damage);
    if(totalDamage==0){
      getAudio([2,0.09,0.04,0.19,0.12,0.13,0.08,-0.6065,-0.82,0.07,0.85,,,,,0.99,-1,-0.86,1,0.74,0.09,0.18,-1,0.5])
    }else{
      getAudio([type,,0.0949,,0.2521,0.4777,,-0.6065,,,,,,,,,,,1,,,0.216,,(totalDamage/(2*damage))])
    }
    if(m.sprite.hit(totalDamage)&&!m.del){
      m.del = 1;
      //make me particles
      createParticles(m.sprite, damage, 0, 0, m.color);
      //create a new element cell to drop out
      m.trigger('death');
      getAudio([3,0.09,0.2099,0.99,0.5199,0.62,0.05,-0.4199,-0.2,,0.1099,,,,,0.5984,0.5199,-0.0849,1,,,,,0.5])
      //enemies.push(new Enemy(~~(Math.random()*4), new Sprite(hero)));
    }
    currentEnemy = m;
  }

  m.drawAvatar = function(vx, vy){
    ctx.fillStyle=white;
    ctx.fillText(m.name, vx-120, vy+20);
    ctx.fillStyle=loop%16==0?black:'yellow';
    ctx.fillRect(vx-335, vy+35, 300,8);
    ctx.fillStyle = '#300';
    ctx.fillRect (vx-334, vy+36, 300*(1-m.sprite.hp/m.maxhp)-2,6);
    if(!m.del||loop%8==0)
      m.sprite.drawFace(vx-135, vy+50);
  }

}