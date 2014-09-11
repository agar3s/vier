var xf = 0;
var yf = 0;
var platformFunctions = {
  a: function(i, y, m, factor){
    return -y+yf;
  },
  b: function(i, y, m, factor){
    return -y+yf +m*(i-xf);
  },
  c: function(i, y, m, factor){
    var grad = (i-xf)%(Math.PI*2);
    return -y+yf+200*m*(Math.cos(grad));
  },
  d: function(i, y, m, factor){
    var grad = (i-xf)%(Math.PI*2);
    return -y+yf+200*m*(Math.tan(grad));
  },
  e: function(i, y, m, factor){
    return -y+yf -m*(i-xf);
  },
  f: function(i, y, m, factor){
    var grad = (i-xf)%(Math.PI*2);
    return -y+yf+200*m*(Math.sin(grad*grad));
  },
  w: function(i, y, m, factor){
    return platformFunctions.c((i+xf),y+yf,m)*(((i+xf)/factor)%3==1?1:1000);
  },
  x: function(i, y, m, factor){
    return platformFunctions.c((i+xf),y+yf,m)*(((i+xf)/factor)%2==1?1000:1);
  }

}

var Level = function(width, enemiesVector, factor, platforms, yi, pendiente, title){
  xf = 0;
  yf=0;
  var m = this;
  m.w = width;
  m.h = 0;
  m.title = title;
  m.enemiesVector = enemiesVector;
  m.totalEnemies = m.enemiesVector.length;
  m.remainingEnemies = 0;
  //m.points = [];
  m.factor = factor;
  //var montains = +20*(2*Math.sin(i/3));
  //var imposible climbing = -i/2+30*(2*Math.tan(i));
  //var y = -20*(2*Math.sin(i/3));
  m.generateLevel = function(functionArray, yi, pendiente){
    var currentIteration = 0;
    var functionIndex = 0;
    var currentFunction = functionArray[0];
    platforms = [];
    for (var i = 0; i <= m.w; i+=m.factor) {
      //var y = -i-20*(Math.sin(i/4));
      //var y = -i/4+20*(2*Math.tan(i));
      //var y = -40;
      var y = platformFunctions[currentFunction](i, yi, pendiente, m.factor);
      m.h=y<m.h?y:m.h;
      platforms.push(new Platform(i,y, m.factor));
      //m.points.push({x:i,y:300+(m.factor)*(Math.sin(i)-Math.cos(i))});
      if(++currentIteration==functionArray[functionIndex+1]){
        currentIteration-=functionArray[functionIndex+1];
        functionIndex+=2;
        currentFunction = functionArray[functionIndex];
        yf = y+yi;
        xf = i;
      }

    };
  }
  m.generateLevel(platforms, yi, pendiente);

  m.draw = function(vx, vy){
    var index = ~~(vx/m.factor);
    if(index<0){index=0;}
    var limit = index + 1+~~(dimensions.w/m.factor);
    if(limit>=platforms.length){limit=platforms.length-1;}
    ctx.fillStyle='#A4A';
    for(i = index; i <= limit; i++) {
      platforms[i].draw();
    }

    ctx.fillStyle=white;
    ctx.fillText(m.remainingEnemies+'/'+m.totalEnemies, vx+900, vy+650);

  }
  m.onEnemyDied = function(){
    if(++m.remainingEnemies==m.totalEnemies){
      //drop the portal
      nextLevel();
    }
  }

  // when the player reach specific position
  m.onPlayerX = function(x){
    if(m.enemiesVector.length==0) return;

    var enemy = m.enemiesVector[0];
    if(x+dimensions.w-300>enemy.sprite.x){

      enemy.sprite.y= viewport.y;
      enemies.push(enemy);
      m.enemiesVector.splice(0,1);
    }
  }

  m.collides = function(sprite){
    var index = ~~(sprite.xi()/m.factor)-1;
    if(index<0)index=0;
    var limit = ~~(sprite.xf()/m.factor)+1;
    if(limit>=platforms.length) limit = platforms.length-1;
    for(i = index; i <= limit; i++) {
      platforms[i].collides(sprite);
    }
  }
}