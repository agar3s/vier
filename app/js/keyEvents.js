var keyMap = 0;
keys={
  '37':1,
  '38':2,
  '39':4,
  '40':8,
  '65':16,
  '83':32,
  '68':64,
  '32':128
}
document.addEventListener('keydown', function(e){
  var key = e.keyCode ? e.keyCode : e.which;
  e.preventDefault();
  keyMap|=keys[key];
});

document.addEventListener('keyup',  function(e){
  var key = e.keyCode ? e.keyCode : e.which;
  e.preventDefault();
  if(keyMap&keys[key])
    keyMap-=keys[key];
  //console.log('u '+key);
});