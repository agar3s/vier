Platform = function(x,y,width){
  var x = x;
  var y = y;
  var width = width;
  var collides = false; 
  return {
    collides: function(){
      if((heroS.xi()>x&&heroS.xi()<x+width||
        heroS.xf()>x&&heroS.xf()<x+width)&&
        (y>heroS.yil()&&y+5<heroS.yf())&&
        (heroS.vy>=0)){
        collides = true;
        heroS.land(y);
      }else{
        collides = false;
        
      }
    },
    draw: function(){
      ctx.fillStyle=collides?'#F00':'#000';
      ctx.fillRect(x, y, width, 5);
    }
  }
}