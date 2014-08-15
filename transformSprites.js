var fs = require('fs');

//assuming sprites with 16X16 dimmension
var cols = 16;
var rows = 16;

var createSprite = function(byteArray){
  var wstream = fs.createWriteStream('./app/sprites/h');
  var buffer = new Buffer(byteArray);
  wstream.write(buffer);
  wstream.end();
};

var spritestream = fs.readFile('./app/sprites/hero.sprite', 'binary', function(err, data){
  if(err){
    console.log(err);
    return;
  }
  var byteArray = [];
  data = data.replace(/\n/g, '');
  for (var i = 0; i < data.length; i++) {
    var character = data[i];
    if(character==='M'){
      byteArray.push(i);
    }
  };
  console.log(byteArray);
  createSprite(byteArray);

});