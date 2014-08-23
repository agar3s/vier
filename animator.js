var fs = require('fs');
var heroSprites = [
  '{I{J{Y{Z#$2347ACEFRScdsu~.~0~>~@~M~P~\\~`~a',
  '{Y{Z{i{j"#$134ACDESVWbcdqru~)~*~+~0~9~A~Q~a~b'
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

fs.writeFile('./animations/hero2', diffArray, function(err){
  if(err){
    console.log('exception:', err);
    return;
  }
  console.log('file created');
});