
var Level = function(width, enemiesVector){
	var m = this;
  m.w = width;
  m.h = 0;
  m.enemiesVector = enemiesVector;
  //m.points = [];
  var factor = 20;
  //var montains = +20*(2*Math.sin(i/3));
  //var imposible climbing = -i/2+30*(2*Math.tan(i));
  //var y = -20*(2*Math.sin(i/3));
  m.generateLevel = function(){
    platforms = [];
    for (var i = 0; i <= m.w; i+=factor) {
      var grad = i%(Math.PI*2);
      //var y = -i-20*(Math.sin(i/4));
      var y = -10*(Math.sin(grad));
    //var y = -i/4+20*(2*Math.tan(i));
      //var y = -40;
      m.h=y<m.h?y:m.h;
      platforms.push(new Platform(i,y, factor));
      //m.points.push({x:i,y:300+(factor)*(Math.sin(i)-Math.cos(i))});
    };
  }
  m.generateLevel();
  m.draw = function(){
    var index = ~~(-viewport.x/factor);
    if(index<0){index=0;}
    var limit = index + ~~(dimensions.w/factor);
    if(limit>=platforms.length){limit=platforms.length-1;}
    ctx.fillStyle='#A4A';
    for(i = index; i <= limit; i++) {
      platforms[i].draw();
    }
  }

  m.releaseEnemy = function(){

  }

  m.collides = function(sprite){
    var index = ~~(sprite.xi()/factor)-1;
    if(index<0)index=0;
    var limit = ~~(sprite.xf()/factor)+1;
    if(limit>=platforms.length) limit = platforms.length-1;
    for(i = index; i <= limit; i++) {
      platforms[i].collides(sprite);
    }
  }
}