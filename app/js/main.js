//@agar3s
var myhero = new HeroT(heroS);

var firexx = new Sprite(fire);
firexx.color = basicColors[0];
firexx.pixelSize = 3;

//enemies.push(new Enemy(2, ~~(Math.random()*4), Math.random()*xlevel.w, Math.random()*14,'jdg30w100ar30', 6,13, 40,3));
//enemies.push(generateMonster(monsterBook.a0, 3,monsterMoves.a));

var tempenemies= [];
tempenemies.push(generateMonster(monsterBook.a1, 4,monsterMoves.b));
//enemies.push(generateMonster(monsterBook.a2, 5,monsterMoves.a));
tempenemies.push(generateMonster(monsterBook.a3, 9,monsterMoves.b));
tempenemies.push(generateMonster(monsterBook.a2, 12,monsterMoves.b));
//tempenemies.push(generateMonster(monsterBook.a3, 100,monsterMoves.b));
var xlevel = new Level(2400, tempenemies, 100);

var loop = 0;

// var boundsv
var xcam = 0; 
var ycam = 0;
var yOld = myhero.sprite.y;


//scale
//ctx.transform(1, 0, 0, 1, 0, 0);
var currentScreen = 'i';

function gameLoop() {
  ctx.clearRect(-viewport.x, viewport.y, dimensions.w, dimensions.h);
  //draw the guys
  xlevel.draw();
  firexx.draw();
  
  heroS.accelerateY(0.8);
  xlevel.collides(heroS);
  if(!myhero.del)
    myhero.update();

  xlevel.onPlayerX(heroS.x);

  for (var j = powers.length - 1; j >= 0; j--) {
    with(powers[j]){
      update();
      sprite.draw();
      if(loop%4==0){
        animate();
      }
      if(loop%2==0)collides();
      if(outside||del){
        powers.splice(j, 1);
      }
    }
  }

  for (var j = enemies.length - 1; j >= 0; j--) {
    with(enemies[j]){
      if(del){
        enemies.splice(j, 1);
        continue;
      }
      sprite.draw();
      sprite.accelerateY(0.8);
      xlevel.collides(sprite);
      update();
      if(loop%2==0)
        sprite.animate();
    }
  }

  for (var j = enemypowers.length - 1; j >= 0; j--) {
    with(enemypowers[j]){
      update();
      sprite.draw();
      if(loop%4==0){
        animate();
      }
      if(loop%2==0)collidesHero(heroS.bounds());
      if(outside||del){
        enemypowers.splice(j, 1);
      }
    }
  }

  for (var i = particles.length - 1; i >= 0; i--) {
    with(particles[i]){
      draw();
      if(update()){
        particles.splice(i, 1);
      }
    }
  }
  for (var i = boosters.length - 1; i >= 0; i--) {
    with(boosters[i]){
      update()
      xlevel.collides(sprite);
      sprite.draw();
      if(loop%2==0)collidesHero(heroS.bounds());
      if(del){
        boosters.splice(i, 1);
      }
    }
  }

  if(loop%8==0){
    firexx.rotate();
  }
  firexx.updateX();
  
  if(loop%2==0){
    heroS.animate();
  }
  

  //update the viewport
  if(myhero.sprite.x>450+viewport.x&&myhero.sprite.x<xlevel.w-dimensions.w+450){
    viewport.x-=myhero.sprite.vx;
    xxx=-myhero.sprite.vx;
  }else{
    xxx=0;
  }
  yyy = 0;
  if((viewport.y-viewport.oY<-dimensions.h&&myhero.sprite.y+viewport.oY+16*pixelSize>viewport.y+dimensions.h&&myhero.sprite.vy>0))
    yyy= -myhero.sprite.vy;
  else if(myhero.sprite.y-viewport.oY<viewport.y)
    if(myhero.sprite.vy<0)
      yyy= -myhero.sprite.vy;
    else if(myhero.sprite.vy==0)
      yyy = yOld-myhero.sprite.y;
  
  viewport.y-=yyy;
  yOld = myhero.sprite.y;
  ctx.translate(xxx, yyy);

  //draw user interface information
  if(!myhero.del){
    heroS.draw();
    myhero.manage();
    myhero.draw();
  }else{
    currentScreen='d';
  }
}

//different screens
//game state = current screen
var showScreen = {
  g: gameLoop,
  i: introScreen,
  p: pauseScreen,
  d: function(vx, vy){
    gameLoop();
    deadScreen(vx, vy);
  }
}
//actions that the user can do at screen
var actionsScreen = {
  g: function(key){
    currentScreen = 'p';
  },
  i: function(key){
    currentScreen = 'g';
  },
  p: function(key){
    currentScreen = 'g';
  },
  d: function(key){
    console.log('restart level');
  }
}
function mainLoop(){
  showScreen[currentScreen](-viewport.x, viewport.y);
  if(keyMap&256){
    actionsScreen[currentScreen](1);
    keyMap-=256;
  }
  if(loop%64==0){
    loop=0;
  }
  loop++;
  ra(mainLoop);
}

ra(mainLoop);