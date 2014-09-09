//  awfe
// a0412
// w1024
// f4201
// e2140

//  awef
// a0421
// w1042
// e2104
// f4210

//a=0   //purple
//w=1   //azul
//f=2   //orange
//e=3   //green
var elementalMatriz = [[0,4,2,1],
                       [1,0,4,2],
                       [2,1,0,4],
                       [4,2,1,0]];
function getTotalDamage(from, to, damage){
  return elementalMatriz[from][to]*damage/2;
}

var ElementalSkill = function(types, charge){
  var m = this;
  m.elements = types;
  m.charges = [];
  m.current = m.elements[0];
  m.currentQ = charge;  //current quantity
  for (var i = 0; i < types.length; i++) {
    m.charges.push(charge);
  }

  m.power = function(vy, x, y){
    if(m.charges[m.current]-->0){
      var power = new Power(m.current, 2, x, y,  heroS.direction?10:-10, vy);
      powers.push(power);
      m.updateCurrentQ();
    }else{
      m.charges[m.current]=0;
      m.updateCurrentQ();
    }
  }
  m.updateCurrentQ = function(){
    m.currentQ = m.charges[m.current];
  }
  m.draw = function(vx, vy){

    //ctx.fillText (""+myhero.skills.current, vx+75, vy-65);
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = i==m.current&&loop%8==0?'#000':basicColors[i];
      ctx.fillText (""+m.charges[i], vx+30+(i%2==0?35:i==1?69:0), vy-35-(i%2==1?30:i==0?60:0));
    };
    // ctx.fillStyle = basicColors[0];
    // ctx.fillText (""+m.charges[0], vx+65, vy-95);
    // ctx.fillStyle = basicColors[1];
    // ctx.fillText (""+m.charges[1], vx+99, vy-65);
    // ctx.fillStyle = basicColors[2];
    // ctx.fillText (""+m.charges[2], vx+65, vy-35);
    // ctx.fillStyle = basicColors[3];
    // ctx.fillText (""+m.charges[3], vx+30, vy-65);
    firexx.x = vx+50;
    firexx.y = vy-95;
    firexx.draw();
  }
}

var ElementCell = function(type, energy, x, y){

}