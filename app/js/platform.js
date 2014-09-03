var Platform = function(x,y,width){
  var m = this;
  m.x = x;
  m.y = y;
  m.width = width;
  m.collide = 0;
  m.collides = function(){
    if((heroS.xi()>m.x&&heroS.xi()<m.x+m.width||
      heroS.xf()>m.x&&heroS.xf()<m.x+m.width)&&
      (m.y>heroS.yil()&&m.y+5<heroS.yf())&&
      (heroS.vy>=0)){
      m.collide = 1;
      heroS.land(y);
    }else{
      m.collide = 0;
//      heroS.landed = 0;
    }
  },
  m.draw = function(){
    //ctx.fillStyle=m.collide?'#F00':'#668';
    //ctx.fillRect(m.x, m.y, m.width, 500);
    ctx.fillStyle=m.collide?'#F44':'#663';
    ctx.fillRect(m.x, m.y, m.width, 5);
  }
}