var fs = require('fs');
var heroSprites = [
  '{\'{*{4{7{8{9{:{={D{E{H{I{L{M{U{V{[{\\{e{f{g{h{i{j{k{l{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',
  '{#{\'{*{.{3{4{7{8{9{:{={>{D{E{H{I{L{M{U{V{[{\\{e{f{g{h{i{j{k{l{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',
  '{#{.{3{4{7{:{={>{D{E{G{H{I{J{L{M{U{V{X{Y{[{\\{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',
  '{#{.{3{4{7{:{={>{D{E{G{H{I{J{L{M{V{X{Y{[{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',//3
  '{#{\'{*{.{3{4{7{8{9{:{={>{E{H{I{L{V{[{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',//4
  '{#{\'{*{.{4{7{8{9{:{={E{H{I{L{V{[{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',//5
  '{${-{4{7{:{={E{G{H{I{J{L{V{X{Y{[{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',//6
  '{${-{4{5{7{:{<{={E{G{H{I{J{L{V{X{Y{[{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',//7
  '{${\'{*{-{4{5{7{8{9{:{<{={E{H{I{L{U{V{[{\\{f{g{h{i{j{k{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b',//8
  '{\'{*{4{7{8{9{:{={D{E{H{I{L{M{U{V{[{\\{e{f{g{h{i{j{k{l{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b'
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

fs.writeFile('./animations/grandMaster', diffArray, function(err){
  if(err){
    console.log('exception:', err);
    return;
  }
  console.log('file created');
});