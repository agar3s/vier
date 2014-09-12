var monster1 = '{\'{({){*{7{8{9{:{G{H{I{J{W{X{Y{Z{e{f{g{h{i{j{u!"#$%./2367>?BCFGHRSbcrs~-~.~/~0~1~2~=~>~?~@~A~B~I~J~K~L~Q~R~Y~Z~[~\\~a~b';
var monster2 = '';
var monster3 = "{&{'{({){*{5{6{7{8{:{;{F{G{H{K{O{V{W{X{Y{Z{[{_{`{h{i{j{k{n{o{p!\"#$%)*+./013567:;=ABCDEHIJKMSZ[]^abcdejmnqsu~%~-~.~/~;~<~@~A~I~J~K~Q~R~Y~Z~[~a~b~i~q~r~s~t";
var monster4 = '';
var monster5 = '';
var monster6 = '';
var boss1 = '{D{L{S{T{V{W{X{Y{Z{\\{]{c{d{e{f{g{h{i{j{k{l{m{t{u#&\'0123456@ABCDEFQRSTUabcderst';

var superAggressive = 'lgajdag10jdsajd';

var monsterSprites={
  A0:monster1,
  A1:hero,
  A2: monster3,
  A3:hero,
  A4:boss1,
  A5:hero,//only one sprite for the grand master
  A6:hero,
  W0:hero,
  W1:hero,
  W2:monster3,
  W3:hero,
  W4:boss1,
  W5:hero,//only one sprite for the grand master
  W6:hero,
  E0:hero,
  E1:hero,
  E2:monster3,
  E3:hero,
  E4:boss1,
  E5:hero,//only one sprite for the grand master
  E6:hero,
  F0:hero,
  F1:hero,
  F2:monster3,
  F3:hero,
  F4:boss1,
  F5:hero,//only one sprite for the grand master
  F6:hero,
}

var monsterAnimations = {
  B0: {
    i:{
      kf:monster1,
      f:[0,0,0,12,0,12]
    }
  },
  B1: heroAnimations,
  B2: {
    i:{
      kf:monster3,
      f:[0,6,7,8,8,7,6,0]
    }
  },
  B3: heroAnimations,
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
};

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
  b: 'lf80sw30asw30t',
  m: 'w20hk20f9w9m20tas',
  n: 'ljw20tg60stf30asw20'
}
//vx,hp,psize,coldown,trigger
var monsterAttributes = {
  minion: '2060F0',
  boss1: '310490',
  boss2: '301490'
}
// nameCode     1 digit
// type         1 digit
var monsterBook = {
  a0: '00'+monsterAttributes.minion,
  a1: '01'+monsterAttributes.minion,
  a2: '02'+monsterAttributes.minion,
  a3: '03'+monsterAttributes.minion,
  x1: '23'+monsterAttributes.boss1,
  x2: '40'+monsterAttributes.boss2,
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
