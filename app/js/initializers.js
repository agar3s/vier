var doc = document;
doc.get = doc.getElementById;
var canvas = doc.get('c');
var canvitas = canvas;
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


function getShader(gl, id) {
  var currentChild=doc.get("2d-"+id+"-shader").firstChild;
  var shader;
  if(id == 'fragment') {
    shader=gl.createShader(gl.FRAGMENT_SHADER);
  }else{
    shader=gl.createShader(gl.VERTEX_SHADER);
  }
  gl.shaderSource(shader, currentChild.textContent);
  gl.compileShader(shader);
  return shader;
}

var c3d=doc.get('canvas3d');
var gl=c3d.getContext('webgl');
gl.tp=gl.texParameteri;
gl.ga=gl.getAttribLocation;
gl.eva=gl.enableVertexAttribArray;
gl.vap=gl.vertexAttribPointer;
gl.AB=gl.ARRAY_BUFFER;
with(gl){
  var s1=getShader(gl, 'vertex');
  var s2=getShader(gl, 'fragment');
  var p=createProgram();
  attachShader(p, s1);
  attachShader(p, s2);
  linkProgram(p);
  useProgram(p);
  var pl=ga(p, 'ap');
  var tcl=ga(p, 'at');
  bindBuffer(AB, createBuffer());
  bufferData(AB, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), DYNAMIC_DRAW);
  eva(tcl);
  vap(tcl, 2, FLOAT, false, 0, 0);
  var txt=createTexture();
  bindTexture(TEXTURE_2D, txt);
  tp(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
  tp(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
  tp(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
  uniform2f(getUniformLocation(p, 'ur'), c3d.width, c3d.height);
  bindBuffer(AB, createBuffer());
  eva(pl);
  vap(pl, 2, FLOAT, false, 0, 0);
  bufferData(AB, new Float32Array([
    0, 0,
    c3d.width, 0,
    0, c3d.height,
    0, c3d.height,
    c3d.width, 0,
    c3d.width, c3d.height]), STATIC_DRAW);
}

// sounds
function getAudio(array){
  var player = new Audio();
  player.src = jsfxr(array);
  setTimeout(function(){player.play()}, 1);
}
