var keyMap = 0;
var keys={
  '37':1,         // left
  '38':2,         // up
  '39':4,         // right
  '40':8,         // down
  '65':16,        // d next
  '83':32,        // s attack
  '68':64,        // a previous
  '32':128,       // space jump
  '13':256        // enter key 
}
doc.addEventListener('keydown', function(e){
  var key = e.keyCode ? e.keyCode : e.which;
  if(keys[key]){
    keyMap|=keys[key];
    e.preventDefault();
  }
});

doc.addEventListener('keyup',  function(e){
  var key = e.keyCode ? e.keyCode : e.which;
  if(keyMap&keys[key]){
    keyMap^=keys[key];
    e.preventDefault();
  }
  //console.log('u '+key);
});