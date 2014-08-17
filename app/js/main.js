
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
  var frames = [];
  var iFrame = 0;
  function convertTobyte(d){
    var bArray = new Int16Array(16);
    for (i = 0; i < d.length; i++) {
      //var y = data[i] >> 4;       // takes the y index 
      //var x = data[i] & 0XF;      // takes the x index 
      //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
      bArray[d[i] >> 4] |= 1<<15-(d[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
    }
    return bArray;
  }
  function toData(){
    return data;
  }
  byteArray = convertTobyte(data);

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
    for (j = 0; j < 16; j++) {
      byteArray[j] = byteArray[j]^frames[iFrame][j];
      for (i = 0; i < 16; i++) {
        if(1<<(15-i)&byteArray[j]){
         data2.push(j*16+i);
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
    animate: animate
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
//file:///p/vier/app/index.html

drawGrilla();
data = loadByString(hero);
heroS = new Sprite(data);
for (j = 0; j < heroAnimation.length; j++) {
  var ha = frames[heroAnimation[j]];
  heroS.addFrame(loadByString(ha));
};

data = loadByString(fire);
fireS = new Sprite(data);

function cleanSpace(){
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,500,500);
}

var loop = 0;
function repeatOften() {
  cleanSpace();
  //drawCharacter(fireS.toData(), 'rgb(238,102,0)', 3);
  drawCharacter(heroS.toData(), '#000', 3);
  if(loop%2==0){
    //fireS.rotate();
    heroS.animate();
  }
  requestAnimationFrame(repeatOften);
  loop++;
}
requestAnimationFrame(repeatOften);