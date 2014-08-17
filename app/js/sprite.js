Sprite = function(data){
  var byteArray = new Int16Array(ppp);
  var data = data;
  var frames = [];
  var iFrame = 0;
  var color = '#000';
  var x=0, y=0;
  function convertTobyte(d){
    var bArray = new Int16Array(ppp);
    for (i = 0; i < d.length; i++) {
      //var y = data[i] >> 4;       // takes the y index 
      //var x = data[i] & 0XF;      // takes the x index 
      //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
      bArray[d[i] >> 4] |= 1<<pp1-(d[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
    }
    return bArray;
  }
  function toData(){
    return data;
  }
  byteArray = convertTobyte(data);

  function rotate(){
    var data2 = [];
    for (i = 0; i < ppp; i++) {
      for (j = 0; j < ppp; j++) {
        if(byteArray[i] & 1<<pp1-j){
          data2.push(j*ppp+pp1-i);
        }
      }
    }
    data = data2;
    byteArray = convertTobyte(data);
  }
  function addFrame(data){
    frames.push(convertTobyte(data));
    iFrame = frames.length-1;
  }
  function animate(){
    if(++iFrame>=frames.length){
      iFrame=0;
    }
      data2 = [];
    for (j = 0; j < ppp; j++) {
      byteArray[j] = byteArray[j]^frames[iFrame][j];
      for (i = 0; i < ppp; i++) {
        if(1<<(pp1-i)&byteArray[j]){
         data2.push(j*ppp+i);
        }
      }
    }
    data = data2;
  }
  return {
    toByte: byteArray,
    toData: toData,
    rotate: rotate,
    addFrame: addFrame,
    animate: animate,
    color: color,
    setColor: function(c){
      color = c;
    },
    left: function(){
      console.log('ai');
      x-=5;
    },
    right: function(){
      x+=5;
    },
    jump: function(){
      y+=10;
    },
    drawCharacter: function(pixelSize){
      ctx.fillStyle = color;
      for(i = 0; i < data.length; i++) {
        //var y = array[i] >> 4;
        //var x = array[i] & 0XF;
        ctx.fillRect(x+(data[i] & 0XF)*pixelSize, y+(data[i] >> 4)*pixelSize, pixelSize, pixelSize);
      };
    }
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