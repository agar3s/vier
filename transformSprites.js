var fs = require('fs');


//assuming sprites with 16X16 dimmension
var cols = 16;
var rows = 16;


/* byte version..
var createSprite = function(name, byteArray){
  var wstream = fs.createWriteStream('./app/sprites/'+name);
  //var buffer = new Buffer(byteArray);
  //var encoded = encodeByteArray(byteArray);
  //console.log(encoded);
  wstream.write(buffer);
  wstream.end();
};
*/
var createSprite = function(name, byteArray){
  var encoded = '';
  // for (var i = 0; i < byteArray.length; i++) {
  //   var code=byteArray[i].toString(16);
  //   encoded+=code.length==1?'0'+code:code;
  // };
  
  for (var i = 0; i < byteArray.length; i++) {
    var b = byteArray[i];
    var code = '';
    if(b<0X55){
      code = '{';
    }else if(b<0XAA){
      code = '';
    }else{
      code = '~';
    }
    var byte = b%0X55+0X21;
    code += byte==92?'\\':'';
    code += String.fromCharCode(byte);
    encoded+=code;
  }


  fs.writeFile('./sprites/'+name, encoded, function(err){
    if(err){
      console.log('exception:', err);
      return;
    }
    console.log('file created');
  });
}

var createImage = function(name, byteArray){
  var png = new Png(new Buffer(byteArray), ~~(byteArray.length/3), 1);
  png.encode(function(encodedPng){
    fs.writeFileSync('./sprites/'+name+'.png', encodedPng.toString('binary'), 'binary');
  });
};

var transformSprite = function(file){
  var spritestream = fs.readFile('./sprites/' + file + '.sprite', 'binary', function(err, data){
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
      if(character==='/'){
        break;
      }
    };
    createSprite(file.replace('.sprite', ''), byteArray);
    //createImage(file[0], byteArray);
  });
};

transformSprite('wizard00');
transformSprite('wizard01');
transformSprite('wizard02');
