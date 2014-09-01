var Level = function(){
	var m = this;
  m.drawLevel = function(){
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    //var factor = 125.59;
    //var factor = 25.59;
    var factor = 25.59;
    ctx.moveTo(0-myhero.sprite.x, 300+39*Math.sin(0));
    for (var i = 0; i < 3000; i++) {
      i+=1*factor;
      ctx.lineTo(i-myhero.sprite.x, 300+(factor)*(Math.sin(i)-Math.cos(i)));
    };
    ctx.stroke();
  }
}