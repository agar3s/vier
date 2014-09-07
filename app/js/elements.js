//  awfe
// a0412
// w1024
// f4201
// e2140

//a=0   //purple
//w=1   //azul
//f=2   //orange
//e=3   //green
var elementalMatriz = [[0,4,1,2],[1,0,2,4],[4,2,0,1],[2,1,4,0]];
function getTotalDamage(from, to, damage){
  return elementalMatriz[from][to]*damage/2;
}

var ElementalSkill = function(types){
  var m = this;
  m.elements = types;
  m.current = m.elements[0];
}

var ElementCell = function(type, energy, x, y){

}