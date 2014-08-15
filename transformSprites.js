var fs = require('fs');

//assuming sprites with 16X16 dimmension
var cols = 16;
var rows = 16;

var createSprite = function(name, byteArray){
  var wstream = fs.createWriteStream('./app/sprites/'+name);
  var buffer = new Buffer(byteArray);
  wstream.write(buffer);
  wstream.end();
};

var transformSprite = function(file){
  var spritestream = fs.readFile('./app/sprites/' + file + '.sprite', 'binary', function(err, data){
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
    createSprite(file[0], byteArray);

  });
};

transformSprite('hero');
transformSprite('fire');