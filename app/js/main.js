//@agar3s
var xlevel = new Level();
var myhero = new HeroT(heroS);

var firexx = new Sprite(fire);
firexx.color = basicColors[0];
firexx.pixelSize = 3;

enemies.push(new Enemy(1, new Sprite(hero), Math.random()*xlevel.w));
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
  
  heroS.accelerateY(0.8);
  xlevel.collides(heroS);
  if(!myhero.del)
    myhero.update();



  for (var j = powers.length - 1; j >= 0; j--) {
    powers[j].update();
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
  }

  for (var j = enemypowers.length - 1; j >= 0; j--) {
    enemypowers[j].update();
    enemypowers[j].sprite.draw();
    if(loop%4==0){
      enemypowers[j].animate();
    }
    if(loop%2==0)enemypowers[j].collidesHero(heroS.bounds());
    if(enemypowers[j].outside||enemypowers[j].del){
      enemypowers.splice(j, 1);
    }
  }

  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    if(particles[i].update()){
      particles.splice(i, 1);
    }
  }
  for (var i = boosters.length - 1; i >= 0; i--) {
    boosters[i].update()
    xlevel.collides(boosters[i].sprite);
    boosters[i].sprite.draw();
    if(loop%2==0)boosters[i].collidesHero(heroS.bounds());
    if(boosters[i].del){
      boosters.splice(i, 1);
    }
  }

  if(loop%8==0){
    firexx.rotate();
  }
  if(loop%64==0){
    loop=0;
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
  }
  
  loop++;
  ra(gameLoop);
}

ra(gameLoop);