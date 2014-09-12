var map = document.getElementById('map'); 
var pixelMatriz = [];

function updateMap(){
  var data = '';
  for(var j = 0;j<16; j++){
    console.log(j);
    data += pixelMatriz[j].join('')+'\n';
  };
  map.value = data.substring(0, data.length-1);
}

function toggleClass(cellx, clase){  
  cellx.className = 'cell '+(cellx.className.indexOf(clase)!=-1?'':clase);
  var idc = cellx.id;
  var indx = idc.indexOf('-');
  var j = parseInt(idc.substring(1, indx));
  var i = parseInt(idc.substring(indx+1, idc.length));
  pixelMatriz[j][i] = pixelMatriz[j][i]=='_'?'M':'_';
  updateMap();
}

for(var i = 0;i<16; i++){
  pixelMatriz.push([]);
  for(var j = 0;j<16; j++){
    pixelMatriz[i].push('_');
    var cellx = document.getElementById('c'+j+'-'+i);
    map.innerHTML+='_';
    cellx.onclick = function(){
      toggleClass(this, 'black');
    }
  }
  map.innerHTML+='\n';
}

renderMapFromText = function(data){
  //var data = map.value;
  //console.log('map:', map.value);
  var rows = data.split('\n');
  //console.log(rows);
  for(var j =0; j<16;j++){
    for(var i=0; i<16; i++){
      pixelMatriz[j][i]=rows[j][i];
      var cellx = document.getElementById('c'+j+'-'+i);
      //cellx.className = 'cell';
      cellx.className = 'cell ' + (pixelMatriz[j][i]=='M'?'black':'');
    }
  }
};

var clear = document.getElementById('clear');

clear.onclick = function(){
  for(var i=0; i<256; i++){
    pixelMatriz[Math.floor(i/16)][i%16] = "_";
    updateMap();
    document.getElementById('c'+Math.round(i/16)+'-'+(i%16)).className = 'cell';
  }
};


//default hero
var defaultHero = "________________\n"+
"________________\n"+
"_______MM_______\n"+
"_______MM_______\n"+
"________________\n"+
"______MMM_______\n"+
"_____M_M_M______\n"+
"_____M_M_M______\n"+
"____M__M__M_____\n"+
"____M_MMM_M_____\n"+
"______M_M_______\n"+
"______M_M_______\n"+
"______M_M_______\n"+
"______M_M_______\n"+
"_____MM_MM______\n"+
"________________";

var loadSample = document.getElementById('reset');

loadSample.onclick = function(){
  map.value = defaultHero;
  renderMapFromText(map.value);
};

map.onkeyup = function(){
  renderMapFromText(map.value);
}
map.value = defaultHero;
renderMapFromText(defaultHero);

var frames = [];
var framesDom = document.getElementById('frames');
var saveF = document.getElementById('savef');
var newF = document.getElementById('newf');
var currentFrame = 0;
function setCurrentFrame(index){
  document.getElementById('f'+currentFrame).className = 'frame';
  currentFrame = index;
  document.getElementById('f'+currentFrame).className = 'frame active';
  
};
newF.onclick = function(){
  var fbutton = document.createElement("BUTTON");
  fbutton.className = 'frame';
  fbutton.innerHTML =frames.length;
  fbutton.id='f'+ frames.length;
  framesDom.appendChild(fbutton);
  
  fbutton.onclick = (function(){
    var index = frames.length;
    return function(){
      setCurrentFrame(index);
      map.value = frames[index];
      renderMapFromText(map.value);
    }
  })();
  setCurrentFrame(frames.length);
  frames.push(map.value);
  
};
saveF.onclick = function(){
  if(frames.length==0){
    newf.onclick();    
  }else{
   frames[currentFrame] = map.value; 
  }
}

//stands hero...'
// load presets
// create frame
// create animation...
var animationFrames = [];
var loadAnimation = document.getElementById('loadAnimation');
console.log(loadAnimation);
var animation = document.getElementById('animation');
console.log(animation);
var pause = true;

var play = document.getElementById('run');
console.log(play);
play.onclick = function(){
  pause =!pause;
  play.innerHTML = pause?'play':'pause';
};

loadAnimation.onclick = function(){
  animationFrames = animation.value.split(',');
};
var cont = 0;
var updateLoop = 0;
function loop(){
  if(++updateLoop%4==0&&!pause){
    setCurrentFrame(animationFrames[cont]);
    map.value = frames[currentFrame];
    
    renderMapFromText(map.value);
    if(++cont>=animationFrames.length){
      cont=0;
    }
    updateLoop=0;
  }
  

  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

var exportb = document.getElementById('export');
var exported = document.getElementById('exported');
exportb.onclick = function(){
  exported.value = frames.join('\n//new Frame\n') + '\nAnimation:\n'+animation.value;
};

var importb = document.getElementById('import');
importb.onclick = function(){
  frames = exported.value.split('\n//new Frame\n');
  currentFrame = 0;
  framesDom.innerHTML = '';
  
  for(var i =0; i<frames.length;i++){
  var fbutton = document.createElement("BUTTON");
  fbutton.className = 'frame';
  fbutton.innerHTML =i;
  fbutton.id='f'+ i;
  framesDom.appendChild(fbutton);
  
  fbutton.onclick = (function(){
    var index = i;
    return function(){
      setCurrentFrame(index);
      map.value = frames[index];
      renderMapFromText(map.value);
    }
  })();
    
  }

  
  
};


