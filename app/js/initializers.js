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

var zoomFactor =(innerHeight-100)/dimensions.h; 
//var zoomFactor =1; 
canvas.width = dimensions.w*zoomFactor;
canvas.height = dimensions.h*zoomFactor;
ctx.scale(zoomFactor, zoomFactor);
ctx.translate(viewport.x, -viewport.y);

var powers = [];
var elementColors = [295, 205,25,115];
var basicColors = ['#E0F', '#09F', '#F60', '#1F0'];
var enemies = [];
var particles = [];
var platforms = [];
var currentEnemy = null;

//set text style
ctx.font = "normal lighter 18px fantasy";


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
