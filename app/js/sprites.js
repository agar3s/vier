window.fire = '{f{g{h{i{u!$%056?@ABFORV`bcefostu~,';
window.hero  = '{H{I{X{Y"#$134ACEQSVacdsu~.~1~=~@~M~P~]~^~`~a';
window.heropower = '{I{J{Y{Z"#$134ACERSVcdsu~.~0~=~?~M~O~]~^~_~`';
window.herorun = '{Y{Z{i{j"#$134ACDESVWbcdqru~)~*~+~0~9~A~Q~a~b';
window.herojump = '{Z{[{g{h{i{j{k!#$134ACESTcesu~-~0~=~?~L~O~\\~_';
window.powerAnimation = '';
window.frames = [
  '',
  '~A~>~0tqfUD2{i{h~@~=~1udVE1$#"{I{H',
  'B65VREA',
  '~@~>tD2(\'&%{m{j{i~?~=udB651"{J{I',
  '~_~P~O~J~;~:~,tUB~b~a~Q~9~+~*~)uqWEA',
  '~`~M~?~>~=~/T2{k{[~P~J~A~;~:~0~,rdbVB1"{i{Y'
];

window.heroAnimation = [0,0,0,0,0,0,0,0,0,1];
window.heropowerAnimation = [2,3,3,2,0,-1];
window.herorunAnimation = [0,4,0,5,0,5,0,4,0];
window.herojumpAnimation = [0];

window.animations = {
  idle:{
    keyframe:window.hero,
    frames: window.heroAnimation
  },
  power:{
    keyframe:window.heropower,
    frames: window.heropowerAnimation
  },
  run:{
    keyframe:window.herorun,
    frames: window.herorunAnimation
  },
  jump:{
    keyframe:window.herojump,
    frames: window.herojumpAnimation
  }
}