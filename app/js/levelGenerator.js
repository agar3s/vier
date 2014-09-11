
var LevelGenerator = function(level){
  var codeMonsters = level.codeMonsters;
  var platformFunctions = level.plats;
  var monsters = [];
  for (var i = 0; i < codeMonsters.length; i++) {
    var codeMonster = codeMonsters[i];
    var type = codeMonster[0]+ codeMonster[1];
    var moves = codeMonster[2];
    var hp = parseInt(codeMonster.substring(3));
    monsters.push(generateMonster(monsterBook[type], hp, monsterMoves[moves]));
  }
  return new Level(level.width, monsters, level.factor, platformFunctions, level.yi, level.pendiente);
  
}
var currentLevel = 'level2';
var levels = {
  level1: {
    codeMonsters: ['a1b4','a3b9','a2b12', 'a0b15', 'a3b24', 'a0b27', 'a1b30', 'a2b35'],
    plats: ['a', 10,'b', 20,'a', 10, 'b', 7,'a',15, 'w', 23, 'a', 100],
    width: 3700,
    factor: 28,
    yi: 0,
    pendiente: -0.1,
    title: 'Chapter 1',
    nextl:'boss1'
  },
  boss1: {
    codeMonsters:['a1b4'],
    plats:['c',30],
    width: 1300,
    factor: 50,
    yi: 0,
    pendiente: -0.1,
    title: 'Boss 1',
    nextl:'level2'
  },
  level2: {
    codeMonsters: ['a1b4','a3b9','a2b12', 'a0b15', 'a3b24', 'a0b27', 'a1b30', 'a2b35'],
    plats: ['b', 30,'a', 20,'b', 30, 'a', 7,'e',35, 'x', 22, 'a', 100],
    width: 4500,
    factor: 28,
    yi: 0,
    pendiente: -0.5,
    title: 'Chapter 2',
    nextl:'boss2'
  },
  boss2: {
    codeMonsters:['a1b4'],
    plats:['x',300],
    width: 1300,
    factor: 28,
    yi: 0,
    pendiente: -0.1,
    title: 'Boss 2',
    nextl:'level3'
  },
  level3: {
    codeMonsters: ['a1b4','a3b9','a2b12', 'a0b15', 'a1b20', 'a2b30', 'a3b40', 'a0b45', 'a1b50', 'a2b55', 'a2b70', 'a3b80'],
    plats: ['a', 6,'f', 7,'a', 5, 'b', 7,'a', 5,'e',10,'x',10, 'a',100],
    width: 8400,
    factor: 150,
    yi: 0,
    pendiente: -0.5,
    title: 'Chapter 1'
  }
}

var xlevel = LevelGenerator(levels[currentLevel]);

function restartLevel(wy){
  enemies = [];
  powers = [];
  enemypowers = [];
  boosters = [];
  ctx.translate(-viewport.x, wy+viewport.y);
  console.log(720+viewport.y);
  viewport.x=0;
  viewport.y=-wy;
  xlevel = LevelGenerator(levels[currentLevel]);
  heroS.reset();
  myhero.reset();
}

function nextLevel(){
  console.log('cl',currentLevel);
  currentLevel = levels[currentLevel].nextl;
  console.log(levels[currentLevel]);
  restartLevel(0);
}

//restartLevel();