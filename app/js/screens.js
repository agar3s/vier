function introScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(vx, vy, dimensions.w, dimensions.h);
  ctx.strokeStyle=white;
  ctx.fillStyle=white;
  ctx.font='normal lighter 72px fantasy';
  ctx.strokeText ("VIER", vx+dimensions.w/2, vy+dimensions.h*0.1);
  setFont(0);
  ctx.fillText ("Agtaske's Rising", vx+dimensions.w/2, vy+dimensions.h*0.2);
  ctx.fillText ("Press <Enter> to Start", vx+dimensions.w/2, vy+dimensions.h*0.4);
  ctx.fillText ("made by @agar3s", vx+dimensions.w/2, vy+dimensions.h*0.9);
}

function pauseScreen(vx, vy){
  //draw pause screen
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(vx, vy, dimensions.w, dimensions.h);
  ctx.fillStyle=white;
  setFont(0);
  ctx.fillText ("PAUSE", vx+dimensions.w/2, vy+dimensions.h*0.3);
  setFont(1);
  ctx.fillText ("Controls", vx+dimensions.w/2, vy+dimensions.h*0.5);
  ctx.fillText ("Powers", vx+dimensions.w/2, vy+dimensions.h*0.6);
}

function deadScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.fillRect(vx, vy, dimensions.w, dimensions.h);
  ctx.fillStyle=white;
  setFont(0);
  ctx.fillText ("DEAD", vx+dimensions.w/2, vy+dimensions.h*0.3);
  setFont(1);
  ctx.fillText ("enter to restart level", vx+dimensions.w/2, vy+dimensions.h*0.5);
}