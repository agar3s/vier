var Enemy = function(type, sprite){
  var m = this;
  m.type = type;
  m.sprite = sprite;
  m.sprite.color = '#FFF';
  m.sprite.setAnimation('i');
  m.sprite.pixelSize = 15;
  m.f = 10;
  m.w = 0;
  m.a = 0;
  m.e = 0;
  m.sprite.maxVx = heroS.maxVx*0.9;
  m.sprite.x = 300;
  m.follow = function(){
    if(m.sprite.x<heroS.x){
      m.sprite.right();
    }else{
      m.sprite.left();
    }
  }
  m.away = function(){
    if(m.sprite.x<heroS.x&&m.sprite.x>0){
      m.sprite.left();
    }else if(m.sprite.x>heroS.x&&m.sprite.x+16*m.sprite.pixelSize<xlevel.w){
      m.sprite.right();
    }else{
      m.sprite.stopX();
    }
  }

  m.update = function(){
    //m.follow();
    m.away();
    m.sprite.update();

  }

}