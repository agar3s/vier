var hue = 0;
function introScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(vx, vy, 1024, 720);
  randomParticles();
  ctx.fillStyle=basicColors[1];
  ctx.strokeStyle='hsl('+(++hue)%720+',50%,50%)';
  ctx.font='normal lighter 242px fantasy';
  ctx.strokeText ("VIER", vx+512, vy+720*0.3);
  ctx.font='normal lighter 30px fantasy';
  ctx.lineWidth = 1;
  ctx.strokeText ("W i z a r d    W a r s", vx+512, vy+720*0.5);
  ctx.font='normal lighter 20px monospace';
  ctx.fillText ("Press         to Start", vx+512, vy+720*0.6);
  ctx.fillText ("made by @agar3s", vx+512, vy+720*0.9);
  ctx.fillStyle=loop%16==0?basicColors[1]:basicColors[0];
  ctx.fillText ("      <Enter>         ", vx+512, vy+720*0.6);
  for (var i = particles.length - 1; i >= 0; i--) {
    with(particles[i]){
      draw();
      if(update()){
        particles.splice(i, 1);
      }
    }
  }

}
ctx.ft = ctx.fillText;
function pauseScreen(vx, vy){
  //draw pause screen
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(vx, vy, dimensions.w, 720);
  ctx.fillStyle=white;
  setFont(0);
  ctx.ft ("PAUSE", vx+512, vy+720*0.2);
  ctx.ft ("Controls", vx+512, vy+720*0.3);
  
  ctx.ft ("<S>: Shoot", vx+dimensions.w*0.5, vy+720*0.4);

  ctx.ft ("<- : move to left ", vx+dimensions.w*0.2, vy+720*0.48);
  ctx.ft ("-> : move to right", vx+dimensions.w*0.2, vy+720*0.53);

  ctx.ft ("<space>   : jump       ", vx+dimensions.w*0.5, vy+720*0.48);
  ctx.ft ("<space>2X : double jump", vx+dimensions.w*0.5, vy+720*0.53);
  
  ctx.ft ("<D> : next element    ", vx+dimensions.w*0.8, vy+720*0.48);
  ctx.ft ("<A> : previous element", vx+dimensions.w*0.8, vy+720*0.53);

  
  ctx.ft ("Powers", vx+512, vy+720*0.63);
  
  ctx.ft ("      beats      ", vx+512, vy+720*0.7);
  ctx.ft ("      beats     ", vx+dimensions.w*0.7, vy+720*0.8);
  ctx.ft ("     beats    ", vx+512, vy+720*0.9);
  ctx.ft ("    beats      ", vx+dimensions.w*0.3, vy+720*0.8);
  
  ctx.fillStyle=basicColors[1];
  ctx.ft ("Water            ", vx+512, vy+720*0.7);
  ctx.ft ("          Water", vx+dimensions.w*0.3, vy+720*0.8);
  
  ctx.fillStyle=basicColors[2];
  ctx.ft ("Earth           ", vx+dimensions.w*0.7, vy+720*0.8);
  ctx.ft ("            Earth", vx+512, vy+720*0.7);
  
  
  ctx.fillStyle=basicColors[3];
  ctx.ft ("Fire          ", vx+512, vy+720*0.9);
  ctx.ft ("            Fire", vx+dimensions.w*0.7, vy+720*0.8);
  
  ctx.fillStyle=basicColors[0];
  ctx.fillText ("Air            ", vx+dimensions.w*0.3, vy+720*0.8);
  ctx.fillText ("           Air", vx+512, vy+720*0.9);

}

function deadScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.fillRect(vx, vy, dimensions.w, 720);
  ctx.fillStyle=white;
  setFont(0);
  ctx.fillText ("DEAD", vx+512, vy+720*0.3);
  setFont(1);
  ctx.fillText ("enter to restart level", vx+512, vy+720*0.5);
}