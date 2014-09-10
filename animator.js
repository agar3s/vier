var fs = require('fs');
var heroSprites = [
  '{&{\'{({){*{5{6{7{8{:{;{F{G{H{K{O{V{W{X{Y{Z{[{_{`{h{i{j{k{n{o{p!"#$%)*+./013567:;=ABCDEHIJKMSZ[]^abcdejmnqsu~%~-~.~/~;~<~@~A~I~J~K~Q~R~Y~Z~[~a~b~i~q~r~s~t',
  '{&{\'{({){*{5{6{7{8{:{;{F{G{H{K{O{V{W{X{Y{Z{[{_{`{h{i{j{k{n{o{p!"#$%)*+/013567:;>ABCDEHIJKNSZ[^_abcdejnoqsu~%~-~.~/~;~<~@~A~J~K~L~Q~R~Z~[~a~b~j~k~q~r~s~t',
  '{%{&{\'{({){4{5{6{7{9{:{E{F{G{J{N{U{V{W{X{Y{Z{^{_{g{h{i{j{m{n{o"#$%()*01235679:?BCDEGHIJOSYZ_`acdeiopqsu~$~-~.~/~0~<~=~@~A~L~M~P~Q~\\~]~`~a~l~m~n~p~q~r',
  '{%{&{\'{({){4{5{6{7{9{:{E{F{G{J{M{U{V{W{X{Y{Z{]{^{g{h{i{j{l{m{n"#$%\'()012356789@ABCDEGHIPSX`acdehpqsu~#~-~.~/~0~=~>~?~@~M~N~O~P~\\~]~_~`~l~m~n~o~p~q~r'
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

fs.writeFile('./animations/skeleton', diffArray, function(err){
  if(err){
    console.log('exception:', err);
    return;
  }
  console.log('file created');
});