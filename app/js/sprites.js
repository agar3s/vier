window.fire = '{f{g{h{i{u!$%056?@ABFORV`bcefostu~,';
window.hero  = '{H{I{X{Y"#$134ACEQSVacdsu~.~1~=~@~M~P~]~^~`~a';
heropower = '{I{J{Y{Z"#$134ACERSVcdsu~.~0~=~?~M~O~]~^~_~`';
herorun = '{Y{Z{i{j"#$134ACDESVWbcdqru~)~*~+~0~9~A~Q~a~b';
herojump = '{Z{[{g{h{i{j{k!#$134ACESTcesu~-~0~=~?~L~O~\\~_';
powerAnimation = '';
window.frames = [
  '',
  '~A~>~0tqfUD2{i{h~@~=~1udVE1$#"{I{H',
  'B65VREA',
  '~@~>tD2(\'&%{m{j{i~?~=udB651"{J{I',
  '~_~P~O~J~;~:~,tUB~b~a~Q~9~+~*~)uqWEA',
  '~`~M~?~>~=~/T2{k{[~P~J~A~;~:~0~,rdbVB1"{i{Y'
];

window.animations = {
  i:{//idle
    kf:window.hero,//key frame
    f: [0,0,0,0,0,0,0,0,0,1] //frames
  },
  p:{
    kf:heropower,
    f: [2,3,3,2,0,-1]
  },
  r:{
    kf:herorun,
    f: [0,4,0,5,0,5,0,4,0]
  },
  j:{
    kf:herojump,
    f: [0]
  }
}