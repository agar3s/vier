var Platform = function(x,y,width){
  var m = this;
  m.x = x;
  m.y = y;
  m.width = width;
  m.collide = 1;
  m.collides = function(sprite){
    if((sprite.xi()>m.x&&sprite.xi()<m.x+m.width||
      sprite.xf()>m.x&&sprite.xf()<m.x+m.width||
      sprite.xi()<m.x&&sprite.xf()>m.x+m.width)&&
      (m.y>sprite.yil()&&m.y+5<sprite.yf())&&
      (sprite.vy>=0)){
      m.collide = 1;
      sprite.land(y);
    }else{
      m.collide = 0;
//      heroS.landed = 0;
    }
  },
  m.draw = function(){
    //ctx.fillStyle=m.collide?'#700':'#668';
    //ctx.fillRect(m.x, m.y, m.width, -xlevel.h+dimensions.w);
    
    ctx.fillRect(m.x, m.y, m.width, 5);
  }
}