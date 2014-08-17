var fs = require('fs');
var heroSprites = [
  '{${5{F{H{I{W{X{Y{h"#13@CPS`bcdrt~-~/~=~?~M~O~\\~]~_~`',
  '{3{4{E{F{H{I{W{X{Y{h"#13@CPS`bcdrt~-~/~=~?~M~O~\\~]~_~`',
  '{3{4{E{F{G{H{W{X{h"#13@CPS`bcdrt~-~/~=~?~M~O~\\~]~_~`',
  '{${5{F{G{H{W{X{h"#13@CPS`bcdrt~-~/~=~?~M~O~\\~]~_~`',
  '{&{6{G{W{X{g{h"#13@CPS`bcdrt~,~0~=~?~M~O~\\~]~_~`',
  '{G{W{g{h"#3ABCPS`cprst~,~0~<~@~M~O~\\~]~_~`',
  '{H{X{g{h"#$4BCQSacrst~,~0~<~@~L~O~\\~_~`~k~l',
  '{I{Y{g{h{i"#$4BCQSacrst~,~0~<~@~L~O~\\~_~`~k~l',
  '{I{Z{g{h{j"#%5BCQSacrst~,~0~<~@~L~O~\\~_~`~k~l',
  '{J{Z{g{h{j"#%5BCQSacrst~,~0~<~@~L~O~\\~_~`~k~l',
  '{K{W{X{[{g{h{k%1234@CPS`crst~,~0~<~@~M~O~\\~]~_~`',
  '{<{K{W{X{[{g{h{j"#$13@CPS`bcdrt~,~0~=~?~M~O~\\~]~_~`',
  '{={G{H{L{W{X{[{j"#$13@CPS`bcdrt~-~/~=~?~M~O~\\~]~_~`'
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

fs.writeFile('./animations/hero', diffArray, function(err){
  if(err){
    console.log('exception:', err);
    return;
  }
  console.log('file created');
});