
var canvas = document.getElementById('c'), ctx = canvas.getContext('2d'), pixelSize = 10, i,j;
var drawGrilla = function(){
  ctx.strokeStyle='#DDD';
  for (i = 0; i < 900; i++) {
    ctx.rect((i%30)*pixelSize, Math.floor(i/30)*pixelSize, pixelSize, pixelSize);
  };
  ctx.stroke();
}

var Sprite = function(data){
  var byteArray = new Int16Array(16);
  var data = data;
  function convertTobyte(){
    byteArray = new Int16Array(16);
    for (i = 0; i < data.length; i++) {
      //var y = data[i] >> 4;       // takes the y index 
      //var x = data[i] & 0XF;      // takes the x index 
      //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
      byteArray[data[i] >> 4] |= 1<<15-(data[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
    }
  }
  function toData(){
    return data;
  }
  convertTobyte();
  console.log(data);
  function rotate(){
    var data2 = [];
    for (i = 0; i < 16; i++) {
      for (j = 0; j < 16; j++) {
        if(byteArray[i] & 1<<15-j){
          data2.push(j*16+15-i);
        }
      }
    }
    data = data2;
    convertTobyte();
  }
  return {
    toByte: byteArray,
    toData: toData,
    rotate: rotate
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

drawGrilla();
loadByString(hero, function(data){
  heroS = new Sprite(data);
});

loadByString(fire, function(data){
  fireS = new Sprite(data)
});

function cleanSpace(){
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,500,500);
}

var loop = 0;
function repeatOften() {
  cleanSpace();
  drawCharacter(fireS.toData(), 'rgb(238,102,0)', 3);
  drawCharacter(heroS.toData(), '#000', 6);
  if(loop%6==0)
    fireS.rotate();
  requestAnimationFrame(repeatOften);
  loop++;
}
requestAnimationFrame(repeatOften);