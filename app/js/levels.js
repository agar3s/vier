var Level = function(){
	var m = this;
  m.w = 3200;
  m.h = 0;
  //m.points = [];
  var factor = 32;
  //var montains = +20*(2*Math.sin(i/3));
  //var imposible climbing = -i/2+30*(2*Math.tan(i));
  m.generateLevel = function(){
    for (var i = 0; i < 3200; i+=1*factor) {
      var grad = i%(Math.PI*2);
      var y = -i/2+30*(2*Math.tan(i));
      m.h=y<m.h?y:m.h;
      platforms.push(new Platform(i,y, 32));
      //m.points.push({x:i,y:300+(factor)*(Math.sin(i)-Math.cos(i))});
    };
  }
  m.generateLevel();
  m.collides = function(){
  }
  m.drawLevel = function(){
  }
}