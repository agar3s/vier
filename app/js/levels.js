var xf = 0;
var yf = 0;
var platformFunctions = {
  a: function(i, y, m, factor){
    var grad = (i-xf)%(Math.PI*2);
    return -y+yf+300*m*(Math.sin(grad));
  },
  b: function(i, y, m, factor){
    return -y+yf;
  },
  c: function(i, y, m, factor){
    return -y+yf +m*(i-xf);
  },
  e: function(i, y, m, factor){
    return platformFunctions.c((i+xf),y+yf,m)*(((i+xf)/factor)%2==1?1000:1)-modI;
  }
}

var Level = function(width, enemiesVector, factor){
  var m = this;
  m.w = width;
  m.h = 0;
  m.enemiesVector = enemiesVector;
  //m.points = [];
  m.factor = factor;
  //var montains = +20*(2*Math.sin(i/3));
  //var imposible climbing = -i/2+30*(2*Math.tan(i));
  //var y = -20*(2*Math.sin(i/3));
  var ejemplo = ['c', 10,'b', 10,'a', 10, 'b',100];
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
        console.log(xf, yf);
      }

    };
  }
  m.generateLevel(ejemplo, 300,-0.1);
  m.draw = function(){
    var index = ~~(-viewport.x/m.factor);
    if(index<0){index=0;}
    var limit = index + ~~(dimensions.w/m.factor);
    if(limit>=platforms.length){limit=platforms.length-1;}
    ctx.fillStyle='#A4A';
    for(i = index; i <= limit; i++) {
      platforms[i].draw();
    }
  }

  m.releaseEnemy = function(){

  }

  // when the player reach specific position
  m.onPlayerX = function(x){
    if(m.enemiesVector.length==0) return;

    var enemy = m.enemiesVector[0];
    if(x+dimensions.w>enemy.sprite.x){
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