var Level = function(){
	var m = this;
  m.w = 1500;
  m.h = 0;
  //m.points = [];
  var factor = 18;
  //var montains = +20*(2*Math.sin(i/3));
  //var imposible climbing = -i/2+30*(2*Math.tan(i));
  m.generateLevel = function(){
    platforms = [];
    for (var i = 0; i <= m.w; i+=factor) {
      var grad = i%(Math.PI*2);
      var y = -20*(2*Math.sin(i/3));
      m.h=y<m.h?y:m.h;
      platforms.push(new Platform(i,y, factor));
      //m.points.push({x:i,y:300+(factor)*(Math.sin(i)-Math.cos(i))});
    };
  }
  m.generateLevel();
  m.draw = function(){
    var index = Math.floor(-viewport.x/factor);
    if(index<0){index=0;}
    var limit = index + Math.floor(dimensions.w/factor);
    for(i = index; i <= limit; i++) {
      platforms[i].draw();
    }
  }
  m.collides = function(){
   for(i = 0; i < platforms.length; i++) {
      platforms[i].collides();
    } 
  }
  m.drawLevel = function(){
  }
}