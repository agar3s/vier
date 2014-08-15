
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var pixelSize = 10;

var drawGrilla = function(){
  for (var i = 0; i < 16*16; i++) {
    ctx.rect((i%16)*pixelSize, Math.floor(i/16)*pixelSize, pixelSize, pixelSize);
  };
  ctx.stroke();
}

var drawCharacter = function(array){
  ctx.fillStyle='#000';
  for (var i = 0; i < array.length; i++) {
    var pixel = array[i];
    var y = pixel >> 4;
    var x = pixel & 0XF;
    ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
  };
}


var xhr = new XMLHttpRequest;
xhr.open('GET', '/sprites/h', true);
xhr.responseType = 'arraybuffer';
xhr.onload = function(){
  var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
  drawCharacter(data);
};

xhr.send(null);