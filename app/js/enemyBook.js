var monsterNames=['Minion', 'Elemental', 'Monster', 'Wizard', 'Master', 'Grand Master', 'Gran Elemental'];
var monster1 = '';
var monster2 = '';
var monster3 = "{&{'{({){*{5{6{7{8{:{;{F{G{H{K{O{V{W{X{Y{Z{[{_{`{h{i{j{k{n{o{p!\"#$%)*+./013567:;=ABCDEHIJKMSZ[]^abcdejmnqsu~%~-~.~/~;~<~@~A~I~J~K~Q~R~Y~Z~[~a~b~i~q~r~s~t";
var monster4 = '';
var monster5 = '';
var monster6 = '';

var superAggressive = 'lgajdag10jdsajd';

var monsterSprites={
  A0:hero,
  A1:hero,
  A2: monster3,
  A3:hero,
  A4:hero,
  A5:hero,//only one sprite for the grand master
  A6:hero,
  W0:hero,
  W1:hero,
  W2:monster3,
  W3:hero,
  W4:hero,
  W5:hero,//only one sprite for the grand master
  W6:hero,
  E0:hero,
  E1:hero,
  E2:monster3,
  E3:hero,
  E4:hero,
  E5:hero,//only one sprite for the grand master
  E6:hero,
  F0:hero,
  F1:hero,
  F2:monster3,
  F3:hero,
  F4:hero,
  F5:hero,//only one sprite for the grand master
  F6:hero,
}

var monsterAnimations = {
  B0: heroAnimations,
  B1: heroAnimations,
  B2: {
    i:{
      kf:monster3,
      f:[0,6,7,8,8,7,6,0]
    }
  },
  B3: heroAnimations,
  B4: heroAnimations,
  B5: heroAnimations,
  B6: heroAnimations,
}

for (var i = 0; i < 7; i++) {
  monsterAnimations['A'+i]= monsterAnimations['B'+i];
  monsterAnimations['W'+i]= monsterAnimations['B'+i];
  monsterAnimations['E'+i]= monsterAnimations['B'+i];
  monsterAnimations['F'+i]= monsterAnimations['B'+i];
};
