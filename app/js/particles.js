var Particle = function(x, y, vx, vy, size, color){
  var m = this;
  m.x = x;
  m.y = y;
  m.vx = vx;
  m.vy = vy;
  m.size = size;
  m.color = color;
  m.life = 100;
  m.update = function(){
    m.x += m.vx;
    m.vy += 0.2;
    m.y += m.vy;
    m.size*=1;
    return --m.life<0;
  }

  m.draw = function(){
    ctx.fillStyle = 'hsla('+m.color+','+m.life+'%, '+m.life+'%, '+m.life/100+')';
    ctx.fillRect(m.x, m.y, m.size, m.size);
  }
}

function createParticles(s, force, vx, vy, color){
  for(var i = 0; i < s.data.length; i++) {
    var k = (s.data[i] & 0XF);
    particles.push(
      new Particle(
        s.x+(s.direction?k:15-k)*s.pixelSize,
        s.y+(s.data[i] >> 4)*s.pixelSize,
        ((s.direction?k:15-k)-8)*force+vx,
        ((s.data[i] >> 4)-8)*force+vy-2,
        s.pixelSize,
        color
        )
    );
  }
}