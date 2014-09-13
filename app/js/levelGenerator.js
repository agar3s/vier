
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
  var m = myhero;
  if(level.locks) m.lock(level.locks);
  if(level.skill){
    m.selectSkill(level.skill);
    m.currentColor = elementColors[m.skills.current];
    m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
  }
  return new Level(level.width, monsters, level.factor, platformFunctions, level.pendiente, level.title);
  
}
var currentLevel = 'boss6b';
var levels = {
  level1: {
    codeMonsters: ['a3b4','a3b9','a3b12', 'a3b15', 'a1b24', 'a1b27', 'a1b30', 'a1b35'],
    plats: ['a', 10,'b', 20,'a', 10, 'b', 7,'a',15, 'w', 15, 'a', 15, 'b',15, 'a',30],
    width: 3700,
    factor: 28,
    pendiente: -0.1,
    title: 'The Beginning',
    nextl:'boss1',
    locks:[0,2],
    skill:1
  },
  boss1: {
    codeMonsters:['x1n4'],
    plats:['c',70],
    width: 1024,
    factor: 20,
    pendiente: -0.05,
    title: 'Fire Skeleton',
    nextl:'level2',
    locks:[0,2],
    skill:1
  },
  level2: {
    codeMonsters: ['a0b4','a2b9','a2b12', 'a0b15', 'a2b18', 'a0b27', 'a2c30', 'a0c35', 'a2c40', 'a0c45'],
    plats: ['a',20,'b', 15,'a', 20,'b', 15, 'a', 7,'v',21, 'a',10, 'b', 22, 'a', 100],
    width: 4800,
    factor: 27,
    pendiente: -0.3,
    title: 'The Gate',
    nextl:'boss2',
    locks:[1,3],
    skill:2
  },
  boss2: {
    codeMonsters:['x2m4'],
    plats:['c',30],
    width: 1024,
    factor: 37,
    pendiente: -0.05,
    title: 'Fire Dragon',
    nextl:'level3',
    locks:[1,3],
    skill:2
  },
  level3: {
    codeMonsters: ['b1b4','b1a9','b2a12', 'b3m15', 'b1a20', 'b2a30', 'b3m40', 'b0m45', 'c1a47', 'c2a55', 'b2a70', 'c3b80'],
    plats: ['a', 6,'f', 6,'a', 5, 'b', 5,'a', 5,'b',5,'x',8, 'c',9,'a',9],
    width: 8400,
    factor: 149,
    pendiente: -0.5,
    title: 'Air Palace',
    nextl:'boss3'
  },
  boss3: {
    codeMonsters:['x3m4'],
    plats:['c',2,'x',24,'c',2],
    width: 1024,
    factor: 50,
    pendiente: -0.1,
    title: 'Air Master',
    nextl:'level4'
  },
  level4:{
    codeMonsters:['d3m4','d2m12','d2m20','d0m22', 'b2a28','b2a31','b2a32', 'b0m44', 'b3m50','a1c58','a3c60','a1c62','a3c64','c2b70', 'c2a75', 'd3d91', 'd1d95', 'd3d99'],
    plats:['a',4,'g',30, 'a',15, 'b',25,'a',15, 'b', 20,'w',18,'a',20,'e',20,'x',10, 'd',20, 'a',50,'v',18,'e',10,'a',20,'e',30,'a',49],
    width: 10024,
    factor: 27,
    pendiente: -0.55,
    title: 'Earth Palace',
    nextl:'boss4'
  },
  boss4: {
    codeMonsters:['x4o4'],
    plats:['h',100],
    width: 1350,
    factor: 50,
    pendiente: -0.01,
    title: 'Earth Master',
    nextl:'level5'
  },
  level5:{
    codeMonsters:['b1b4','e1e19','e3e24', 'f1b30','f3b32', 'd3m40', 'd1m44', 'd0m48', 'd2m56', 'e0a67', 'e3a70', 'e1a73'],
    plats:['a',4,'f',5,'v',9,'a',3,'b',3,'h',3,'e',3,'a',4,'v',6,'a',6],
    width: 7650,
    factor: 170,
    pendiente: -0.5,
    title: 'Water & Fire Montains',
    nextl:'boss5'
  },
  boss5: {
    codeMonsters:['x5p5', 'x6q7'],
    plats:['b',14,'a',12,'e',14],
    width: 1330,
    factor: 35,
    pendiente: -0.1,
    title: 'Water & Fire Masters',
    nextl:'level6'
  },
  level6:{
    codeMonsters:['b2a10', 'b2a12','b2a14','a0f25','a2f26','a2f27','a0f28','b1b38','b3e40','c0b68','c2b70','d1a106','d3m108','f0f110','f2f11','d3m113','d1a115'],
    plats:['a',60,'b',60,'a',60,'c',30,'a',60,'d',20,'a',60,'f',60,'a',60,'b',20,'i',30,'a',20,'v',60,'a',60,'v',33,'a',99],
    width: 12000,
    factor: 16,
    pendiente: -0.8,
    title: 'Grand Master Palace',
    nextl:'boss6a'
  },
  boss6a:{
    codeMonsters:['x7z4'],
    width: 1200,
    plats:['a',2],
    factor: 700,
    pendiente: 1,
    title: 'Grand Master',
    nextl:'boss6b'
  },
  boss6b:{
    codeMonsters:['z1r6','z2r6','z3r6','z4r6'],
    width: 1800,
    plats:['a',3],
    factor: 700,
    pendiente: 1,
    title: 'Element\'s Avatar challenge',
    nextl:'ends'
  },
  ends:{
    codeMonsters:[],
    width: 1800,
    plats:['a',2],
    factor: 700,
    pendiente: 1,
    title: 'Grand master mode',
    nextl:'ends'
  }
}


function restartLevel(wy){
  var level = levels[currentLevel];
  enemies = [];
  powers = [];
  enemypowers = [];
  boosters = [];
  //ctx.translate(-viewport.x, viewport.y);
  ctx.translate(-viewport.x, -wy+viewport.y);
  viewport.x=0;
  viewport.y=wy;
  heroS.reset();
  myhero.reset();
  currentEnemy= undefined;
  xlevel = LevelGenerator(level);

}

function nextLevel(){
  currentLevel = levels[currentLevel].nextl;
  console.log(viewport.y);
  //ctx.translate(-viewport.x, viewport.y+720);
  //viewport
  restartLevel(viewport.y);
}
//var xlevel = LevelGenerator(levels[currentLevel]);

//restartLevel();