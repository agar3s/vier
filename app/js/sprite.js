function convertTobyte(d){
  var bArray = new Int16Array(ppp);
  for (var i = 0; i < d.length; i++) {
    //var y = data[i] >> 4;       // takes the y index 
    //var x = data[i] & 0XF;      // takes the x index 
    //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
    bArray[d[i] >> 4] |= 1<<pp1-(d[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
  }
  return bArray;
}
var Sprite = function(data){
  var m = this;
  m.byteArray = new Int16Array(ppp);
  m.data = data;
  m.frames = [];
  m.iFrame = 0;
  m.color = '#000';
  m.x=0, m.y=0;
  m.vx=0, m.vy=0;
  m.downed=0;
  m.direction = 1;
  m.landed = 0;
  m.byteArray = convertTobyte(m.data);

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
    return m.x+6*5;
  }
  m.xf = function(){
    return m.x+6*11;
  }
  m.yi = function(){
    return m.y+6*2;
  }
  m.yil = function(){
    return m.y+6*13;
  }
  m.yf = function(){
    return m.y+6*16;
  }
  m.accelerateY = function(dvy){
    m.vy+=dvy;
    if(m.vy>18){
      m.vy = 18;
    }
  }
  m.land = function(yf){
    m.vy = 0;
    m.landed = 1;
    m.djump = 0;
    m.downed = 0;
    m.y = yf-6*15;
  }
  m.left = function(){
    m.x-=6;
    m.direction = 0;
  }
  m.right= function(){
    m.x+=6;
    m.direction = 1;
  }
  m.jump= function(){
    if(m.landed){
      m.vy=-3*6;
      m.landed = 0;
    }
  }
  m.down= function(){
    if(!m.downed){
      m.vy+=17;
      m.downed = 1;
    }
  }
  m.up= function(){
    //y-=20;
  }
  m.update= function(){
    m.fall();
    m.x += m.vx;
  }
  m.updateX= function(){
    m.x += m.vx;
  }
  m.drawCharacter= function(pixelSize){
    ctx.fillStyle = m.color;
    ctx.strokeStyle = '#000';
    for(var i = 0; i < m.data.length; i++) {
      //var y = array[i] >> 4;
      //var x = array[i] & 0XF;
      var k = (m.data[i] & 0XF)
      ctx.fillRect(m.x+(m.direction?k:15-k)*pixelSize, m.y+(m.data[i] >> 4)*pixelSize, pixelSize, pixelSize);
    };
  }
}

function loadByString(sprite){
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
