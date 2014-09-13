var monster0 = '{\'{({){*{7{8{9{:{G{H{I{J{W{X{Y{Z{e{f{g{h{i{j{u!"#$%./2367>?BCFGHRSbcrs~-~.~/~0~1~2~=~>~?~@~A~B~I~J~K~L~Q~R~Y~Z~[~\\~a~b';
var monster1 = '{3{4{8{9{B{C{D{E{H{I{J{K{S{T{U{V{X{Y{[{\\{d{e{f{h{i{l{u!$%&\'1267BCQRSTUabcflpqrst~"~\'~*~+~,~.~8~9~:~;~I~J';
var monster2 = "{&{'{({){*{5{6{7{8{:{;{F{G{H{K{O{V{W{X{Y{Z{[{_{`{h{i{j{k{n{o{p!\"#$%)*+./013567:;=ABCDEHIJKMSZ[]^abcdejmnqsu~%~-~.~/~;~<~@~A~I~J~K~Q~R~Y~Z~[~a~b~i~q~r~s~t";
var monster3 = '{4{5{6{7{8{G{H{I{U{V{W{X{Y{g{h"123@BCDGORUV_bors~,~/~<~?~L~P~[~`~k~l~p~q';
var monster4 = '';
var monster5 = '';
var boss1 = '{D{L{S{T{V{W{X{Y{Z{\\{]{c{d{e{f{g{h{i{j{k{l{m{t{u#&\'0123456@ABCDEFQRSTUabcderst';

var elemental0 = '{8{;{H{I{J{K{Y{Z{g{k"#$%&123456@CEPRSTVW`bdru~,~0~<~?~L~M~O~P~Q~\\~]~_~`~a';
var superAggressive = 'lgajdag10jdsajd';

var monsterSprites={
  A0:monster0,
  A1:monster1,
  A2:monster2,
  A3:monster3,
  A4:boss1,
  A5:hero,//only one sprite for the grand master
  A6:hero,
  W0:hero,
  W1:elemental0,
  W2:monster2,
  W3:monster3,
  W4:boss1,
  W5:hero,//only one sprite for the grand master
  W6:hero,
  E0:hero,
  E1:elemental0,
  E2:monster2,
  E3:monster3,
  E4:boss1,
  E5:hero,//only one sprite for the grand master
  E6:hero,
  F0:hero,
  F1:monster1,
  F2:monster2,
  F3:monster3,
  F4:boss1,
  F5:hero,//only one sprite for the grand master
  F6:hero,
}

var monsterAnimations = {
  B0: {
    i:{
      kf:monster0,
      f:[0,0,0,12,0,12]
    }
  },
  B1: heroAnimations,
  B2: {
    i:{
      kf:monster2,
      f:[0,6,7,8,8,7,6,0]
    }
  },
  B3: {
    i:{
      kf:monster3,
      f:[0,14,0,0,0,14]
    }
  },
  B4: {
    i:{
      kf:boss1,
      f:[9,0,10,11,0,0,11,10,9,0]
    }
  },
  B5: heroAnimations,
  B6: heroAnimations,
}

for (var i = 0; i < 7; i++) {
  monsterAnimations['A'+i]= monsterAnimations['B'+i];
  monsterAnimations['W'+i]= monsterAnimations['B'+i];
  monsterAnimations['E'+i]= monsterAnimations['B'+i];
  monsterAnimations['F'+i]= monsterAnimations['B'+i];
}
monsterAnimations.A1 = {
  i:{
    kf: monster1,
    f:[0]
  }
}
monsterAnimations.F1 = monsterAnimations.A1;
monsterAnimations.E1 = {
  i:{
    kf: elemental0,
    f:[0,0,0,0,13]
  }
}
monsterAnimations.W1 = monsterAnimations.E1;
// nameCode     1 digit
// type         1 digit
// vx           1 hexa
// hp           2 hexa
// pixelSize    1 digit (+4)
// coldown      1 hexa (*3)
// triggerType  1 digit
// actionpipe   n characters
var monsterMoves = {
  a: 'ljlw90taw90', //jump wait attack
  b: 'lf80sw30asw30t', // move and attack
  c: 'lg60asw5aw5r20s',
  m: 'w20hk20f9w9m20tas', // fly
  n: 'ljw20tg60stf30asw20'  //
}
//vx,hp,psize,coldown,trigger
var monsterAttributes = {
  minion: '2060F0',
  elemental: '3102E2',
  monster: '3153C1',
  wizard: '415291',
  boss1: '310490',
  boss2: '420490',
  boss3: '430590',
}
// nameCode     1 digit
// type         1 digit
var monsterBook = {
  a0: '00'+monsterAttributes.minion,
  a1: '01'+monsterAttributes.minion,
  a2: '02'+monsterAttributes.minion,
  a3: '03'+monsterAttributes.minion,
  b0: '10'+monsterAttributes.elemental,
  b1: '11'+monsterAttributes.elemental,
  b2: '12'+monsterAttributes.elemental,
  b3: '13'+monsterAttributes.elemental,
  c0: '20'+monsterAttributes.monster,
  c1: '21'+monsterAttributes.monster,
  c2: '22'+monsterAttributes.monster,
  c3: '23'+monsterAttributes.monster,
  d0: '30'+monsterAttributes.wizard,
  d1: '31'+monsterAttributes.wizard,
  d2: '32'+monsterAttributes.wizard,
  d3: '33'+monsterAttributes.wizard,
  x1: '23'+monsterAttributes.boss1,
  x2: '10'+monsterAttributes.boss2,
  x3: '40'+monsterAttributes.boss3,
}

var generateMonster = function(code, x, actionpipe){
  //nameCode, type, vx, actionpipe, hp, pixelSize, coldown, triggerType
  //7 posibilites, 4 posiblities, x 99 posiblities, vx 16 posibilites, string *, hp 256 posibilites, pixelSize, coldown, triggerType
  //1digit, 1digit, 1hexa, array, 2hexa, 1digit, 1hexa, 1digit
  //=,=,*100,=,at the end,
  var nameCode = code[0];
  var type = code[1];
  var vx = parseInt(code[2],16);
  var hp = parseInt(code[3]+code[4],16);
  var pSize = parseInt(code[5])+4;
  var coldown = parseInt(code[6],16)*3;
  var triggerType = code[7];


  return new Enemy(nameCode, type, x*100, vx, actionpipe, hp, pSize, coldown, triggerType);
}
