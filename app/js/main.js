
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

function loadSprite(sprite, callback){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', 'sprites/' + sprite, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(){
    var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
    callback(data);
  };
  xhr.send(null);
}

function loadByImage(sprite, callback){
  window.myImg = new Image();
  myImg.src = 'sprites/'+sprite+'.png';
  var data = [];

  myImg.onload = function(){
    ctx.drawImage(myImg, 0, 0);
    for (i = 0; i < myImg.width; i++) {
      var pixel = ctx.getImageData(i, 0, 1,1).data;
      data.push(pixel[0]);
      data.push(pixel[1]);
      data.push(pixel[2]);
    };
    callback(data);
  };
};
//drawGrilla();

loadByImage('h', function(data){
  console.log('h',data);
  var hero = new Sprite(data);
  drawCharacter(hero.toData, '#000', 10);
});
/**
loadByImage('f', function(data){
  console.log('f',data);
  var fire = new Sprite(data)
  drawCharacter(fire.toData, '#E60', 4);
});
*/
