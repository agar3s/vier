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

var zoomFactor =(window.innerHeight-100)/dimensions.h; 
//var zoomFactor =1; 
canvas.width = dimensions.w*zoomFactor;
canvas.height = dimensions.h*zoomFactor;
ctx.scale(zoomFactor, zoomFactor);
ctx.translate(viewport.x, -viewport.y);

var powers = [];
var heroElementColors = [25,115,205,295];
var enemies = [];
var particles = [];