
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var pixelSize = 10;
var i;
var drawGrilla = function(){
  for (i = 0; i < 256; i++) {
    ctx.rect((i%16)*pixelSize, Math.floor(i/16)*pixelSize, pixelSize, pixelSize);
  };
  ctx.stroke();
}

var Sprite = function(data){
  var byteArray = new Int16Array(16);
  var data = data;
  for (i = 0; i < data.length; i++) {
    //var y = data[i] >> 4;       // takes the y index 
    //var x = data[i] & 0XF;      // takes the x index 
    //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
    byteArray[data[i] >> 4] |= 1<<15-(data[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
  }
  function rotate(){
    var byteArrayT = new Int16Array(16);
    for (var i = 0; i < byteArray.length; i++) {
      byteArrayT[i]
    };
  }
  return {
    toByte: byteArray,
    toData: data
  }
}

var drawCharacter = function(array, color, pixelSize){
  ctx.fillStyle = color;
  for(i = 0; i < array.length; i++) {
    //var y = array[i] >> 4;
    //var x = array[i] & 0XF;
    ctx.fillRect((array[i] & 0XF)*pixelSize, (array[i] >> 4)*pixelSize, pixelSize, pixelSize);
  };
}

function loadByString(sprite, callback){
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
    byteArray.push(char.charCodeAt()+mod);
    char = sprite[++i]
  }
  callback(byteArray);
}

loadByString(hero, function(data){
  var hero = new Sprite(data);
  drawCharacter(hero.toData, '#000', 10);
});

loadByString(fire, function(data){
  var fire = new Sprite(data)
  drawCharacter(fire.toData, '#E60', 4);
});

