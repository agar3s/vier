var convertTobyte = function(d){
  var bArray = new Int16Array(ppp);
  for (var i = 0; i < d.length; i++) {
    //var y = data[i] >> 4;       // takes the y index 
    //var x = data[i] & 0XF;      // takes the x index 
    //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
    bArray[d[i] >> 4] |= 1<<pp1-(d[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
  }
  return bArray;
}
var Sprite = function(code){
  var m = this;
  m.byteArray = new Int16Array(ppp);
  m.data = loadByString(code);
  m.frames = [];
  m.iFrame = 0;
  m.color = '#000';
  m.x=0;
  m.y=-720;
  m.vx=0;
  m.vy=0;
  m.direction = 1;
  m.landed = 0;
  m.byteArray = convertTobyte(m.data);
  m.maxVx = pixelSize*2.2;
  m.accelerationX = 0.25;
  m.pixelSize = 0;
  m.hp = 1; //hitpoints
  m.setPixelSize = function(pixelSize){
    m.pixelSize = pixelSize;
    m.height = m.width = m.pixelSize*16;
  }
  m.setPixelSize(pixelSize);

  m.rotate = function(){
    var data2 = [];
    for (var i = 0; i < ppp; i++) {
      for (var j = 0; j < ppp; j++) {
        if(m.byteArray[i] & 1<<pp1-j){
          data2.push(j*ppp+pp1-i);
        }
      }
    }
    m.data = data2;
    m.byteArray = convertTobyte(data2);
  }
  m.addFrame = function(data){
    m.frames.push(convertTobyte(data));
    m.iFrame = m.frames.length-1;
  }
  m.fall = function(){
    m.y += m.vy;
    if(m.vy<0){
      m.landed = 0;
    }
  }
  m.animate = function(){
    if(++m.iFrame>=m.frames.length){
      m.iFrame=0;
    }
    if(typeof(m.frames[m.iFrame])=='string'){
      return m.setAnimation(m.frames[m.iFrame]);
    }
    var data2 = [];
    for(var j = 0; j < ppp; j++) {
      m.byteArray[j] = m.byteArray[j]^m.frames[m.iFrame][j];
      for (var i = 0; i < ppp; i++) {
        if(1<<(pp1-i)&m.byteArray[j]){
         data2.push(j*ppp+i);
        }
      }
    }
    m.data = data2;
  }
  m.xi = function(){
    return m.x+m.pixelSize*5;
  }
  m.xpi = function(){
    return m.x+m.pixelSize;
  }
  m.xf = function(){
    return m.x+m.pixelSize*11;
  }
  m.xpf = function(){
    return m.x+m.pixelSize*14;
  }
  m.yi = function(){
    return m.y+m.pixelSize*2;
  }
  m.yil = function(){
    return m.y+m.pixelSize*12;
  }
  m.yf = function(){
    return m.y+m.pixelSize*16;
  }
  m.accelerateY = function(dvy){
    //if(m.vy>0)m.setAnimation('jump');
    m.vy+=dvy;
    if(m.vy>m.pixelSize*3){
      m.vy = m.pixelSize*3;
    }
  }
  m.land = function(yf){
    if(!m.landed)m.setAnimation('i');
    m.vy = 0;
    m.landed = 1;
    m.canDoubleJump = 1
    m.downed = 0;
    m.y = yf-m.pixelSize*15;
  }
  m.left = function(){
    if(m.vx>0)m.vx=0;
    m.vx-=m.accelerationX;
    if(m.landed) m.setAnimation('r');
    if(m.vx < -m.maxVx) m.vx = -m.maxVx;
    m.direction = 0;
  }
  m.right= function(){
    if(m.vx<0)m.vx=0;
    m.vx+=m.accelerationX;
    if(m.landed) m.setAnimation('r');
    if(m.vx > m.maxVx) m.vx = m.maxVx;
    m.direction = 1;
  }
  m.forward = function(){
    m.direction?(m.x+17*pixelSize<xlevel.w?m.right():m.stopX()):m.x>0?m.left():m.stopX();
  }
  m.turn = function(){
    m.direction = !m.direction;
  }
  m.stopX = function(){
    if(m.vx!=0){
      m.vx=0;
      m.setAnimation('i');
    }
  }
  m.jump= function(){
    if(m.landed||m.canDoubleJump){
      m.vy=-m.pixelSize*3;
      if(!m.landed)
        m.canDoubleJump = 0;
      m.landed = 0;
      m.setAnimation('j');
    }
  }
  m.update= function(){
    m.fall();
    m.x += m.vx;
  }
  m.updateX= function(){
    m.x += m.vx;
  }
  m.updateY= function(){
    m.y += m.vy;
  }
  m.draw= function(){
    ctx.fillStyle = m.color;
    for(var i = 0; i < m.data.length; i++) {
      //var y = array[i] >> 4;
      //var x = array[i] & 0XF;
      var k = (m.data[i] & 0XF)
      ctx.fillRect(m.x+(m.direction?k:15-k)*m.pixelSize, m.y+(m.data[i] >> 4)*m.pixelSize, m.pixelSize, m.pixelSize);
    };
  }
  m.setAnimation = function(name){
    if(m.currentAnimation == name) return;
    m.currentAnimation = name;
    m.frames = [];
    var animation = animations[name].f;
    m.byteArray = convertTobyte(loadByString(animations[name].kf));
    for (j = 0; j < animation.length; j++) {
      var ha = frames[animation[j]];
      if(animation[j]==-1){
        m.iFrame = m.frames.length;
        return m.frames.push('i');
      }
      m.addFrame(loadByString(ha));
    }
  }
  m.hit = function(damage){
    //console.log('hit!!');
    m.hp-=damage;
    if(m.hp<0) m.hp=0;
    return m.hp==0;
  }
  m.bounds = function(){
    return {
      left:m.xi(),
      right:m.xf(),
      top:m.yi(),
      bottom:m.yf(),
    }
  }
}

var loadByString= function(sprite){
  var i=0, char=sprite[i];
  var byteArray=[];
  var byte = 0;
  while(char){
    var mod = 0X55;
    if(char[0]=='{'){
      char = sprite[++i];
      mod=0;
    }
    if(char[0]=='~'){
      char = sprite[++i];
      mod=0XAA;
    }
    byteArray.push(char.charCodeAt()+mod-0X21);
    char = sprite[++i]
  }
  return byteArray;
}
