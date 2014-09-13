var doc = document;
doc.get = doc.getElementById;
var canvas = doc.get('c');
var ctx = canvas.getContext('2d');
var pixelSize = 4;
var i;
var j;
var ppp=16;
var pp1=15;
var dimensions = {w:1024,h:720};
var viewport = {x:0, y:-720, oY:250};
var black = '#000';
var white = '#fff';
var xlevel;

var xAxis=0;
var yAxis=0;

var currentLevel = 'level1';

var zoomFactor =(innerHeight-100)/dimensions.h; 
//var zoomFactor =1; 
canvas.width = dimensions.w*zoomFactor;
canvas.height = dimensions.h*zoomFactor;
ctx.scale(zoomFactor, zoomFactor);
ctx.translate(viewport.x, -viewport.y);

var powers = [];
var enemypowers = [];
//295, 55
var elementColors = [55, 205, 115, 25,99];
//E
var basicColors = ['yellow', '#09F', '#1F0', '#F60', 'purple'];
var enemies = [];
var particles = [];
var platforms = [];
var boosters = [];
var currentEnemy = null;
var elementalNames=['Air', 'Water', 'Earth', 'Fire'];

//set text style
ctx.textBaseline="middle";
ctx.textAlign="center"; 
function setFont(type){
  ctx.font=type?'normal lighter 12px':'normal lighter 20px monospace';
}
setFont();


//requestAnimationFrame
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
}

if (!requestAnimationFrame) {
  requestAnimationFrame = function(callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

ra = requestAnimationFrame;


function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}