function introScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.strokeStyle=white;
  ctx.fillRect(vx, vy, dimensions.w, dimensions.h);
  ctx.font='normal lighter 72px fantasy';
  ctx.strokeText ("VIER", vx+dimensions.w/2, vy+dimensions.h*0.1);
  setFont(0);
  ctx.strokeText ("Agtaske's Rising", vx+dimensions.w/2, vy+dimensions.h*0.2);
  ctx.strokeText ("Press <Enter> to Start", vx+dimensions.w/2, vy+dimensions.h*0.4);
  ctx.strokeText ("made by @agar3s", vx+dimensions.w/2, vy+dimensions.h*0.9);
}

function pauseScreen(vx, vy){
  //draw pause screen
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.strokeStyle=white;
  ctx.fillRect(vx, vy, dimensions.w, dimensions.h);
  setFont(0);
  ctx.strokeText ("PAUSE", vx+dimensions.w/2, vy+dimensions.h*0.3);
  setFont(1);
  ctx.strokeText ("Controls", vx+dimensions.w/2, vy+dimensions.h*0.5);
  ctx.strokeText ("Powers", vx+dimensions.w/2, vy+dimensions.h*0.6);
}

function deadScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.strokeStyle=white;
  ctx.fillRect(vx, vy, dimensions.w, dimensions.h);
  setFont(0);
  ctx.strokeText ("DEAD", vx+dimensions.w/2, vy+dimensions.h*0.3);
  setFont(1);
  ctx.strokeText ("enter to restart level", vx+dimensions.w/2, vy+dimensions.h*0.5);
}