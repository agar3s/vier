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