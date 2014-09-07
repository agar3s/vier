//@agar3s
var xlevel = new Level();
var myhero = new HeroT(heroS);

var firexx = new Sprite(loadByString(fire));
firexx.color = '#E60';
firexx.pixelSize = 4;


var enemy = new Enemy(2, new Sprite(loadByString(hero)));
enemies.push(enemy);
var loop = 0;

// var boundsv
var xcam = 0; 
var ycam = 0;
var yOld = myhero.sprite.y;

//scale
//ctx.transform(1, 0, 0, 1, 0, 0);
function gameLoop() {
  ctx.clearRect(-viewport.x, viewport.y, dimensions.w, dimensions.h);
  //draw the guys
  xlevel.draw();
  firexx.draw();
  heroS.draw();

  heroS.accelerateY(0.8);
  xlevel.collides(heroS);
  myhero.update();



  for (var j = powers.length - 1; j >= 0; j--) {
    powers[j].updateX();
    powers[j].sprite.draw();
    if(loop%4==0){
      powers[j].animate();
    }
    if(loop%2==0)powers[j].collides();
    if(powers[j].outside||powers[j].del){
      powers.splice(j, 1);
    }
  }

  for (var j = enemies.length - 1; j >= 0; j--) {
    var enemy = enemies[j];
    if(enemy.del){
      enemies.splice(j, 1);
      continue;
    }
    enemy.sprite.draw();
    enemy.sprite.accelerateY(0.8);
    xlevel.collides(enemy.sprite);
    enemy.update();
    if(loop%2==0)
      enemy.sprite.animate();
  };

  if(loop%8==0){
    firexx.rotate();
    loop=0;
  }
  firexx.updateX();
  
  if(loop%2==0){
    heroS.animate();
  }
  myhero.manage();
  

  //update the viewport
  if(myhero.sprite.x>300+viewport.x&&myhero.sprite.x-300<xlevel.w-dimensions.w){
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
  
  loop++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);