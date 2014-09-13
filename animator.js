var fs = require('fs');
var heroSprites = [
  '{&{\'{({){*{5{6{7{8{9{:{;{E{H{K{U{X{[{e{f{j{k{u!%&./012345678=ABCDEIMRSTY]^bcdhimnrst~#~$~,~-~.~/~0~;~<~@~A~J~K~Q~R~Z~[~a~b~h~i~j~k~q~r~s~t',
  '{&{\'{({){*{5{6{7{8{9{:{;{E{H{K{U{X{[{e{f{j{k{s{u!%&-/012345678=ABCDEIMNRSTY]^bcdhirst~#~$~,~-~.~/~0~1~;~<~A~B~J~K~Q~R~Z~[~a~b~c~d~h~i~j~k'
];

function convertArray(sprite){
  var i=0, char=sprite[i];
  var dataArray=[];
  while(char){
    if(char[0]=='{'){
      char += sprite[++i];
    }
    if(char[0]=='~'){
      char += sprite[++i];
    }
    dataArray.push(char);
    char = sprite[++i];
  }
  return dataArray;
}

var diffArray = [];
for (var j = 0; j < heroSprites.length; j++) {
  heroSprites[j] = convertArray(heroSprites[j]);
  if(j==0) continue;
  var diffElement = []; 
  for (var k = heroSprites[j].length - 1; k >= 0; k--) {
    if(heroSprites[j-1].indexOf(heroSprites[j][k])==-1){
      diffElement.push(heroSprites[j][k]);
      if(j==1) console.log(heroSprites[j][k]);
    }
  };
  for (var k = heroSprites[j-1].length - 1; k >= 0; k--) {
    if(heroSprites[j].indexOf(heroSprites[j-1][k])==-1){
      diffElement.push(heroSprites[j-1][k]);
      if(j==1) console.log(heroSprites[j-1][k]);
    }
  };
  diffArray.push(diffElement);
};

var output = '';
for (var i = 0; i < diffArray.length; i++) {
  diffArray[i] = diffArray[i].join('');
};
diffArray = diffArray.join('\n');

fs.writeFile('./animations/earthMaster1', diffArray, function(err){
  if(err){
    console.log('exception:', err);
    return;
  }
  console.log('file created');
});