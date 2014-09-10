var fire = '{f{g{h{i{u!$%056?@ABFORV`bcefostu~,';
var hero  = '{H{I{X{Y"#$134ACEQSVacdsu~.~1~=~@~M~P~]~^~`~a';
var heropower = '{I{J{Y{Z"#$134ACERSVcdsu~.~0~=~?~M~O~]~^~_~`';
var herorun = '{Y{Z{i{j"#$134ACDESVWbcdqru~)~*~+~0~9~A~Q~a~b';
var herojump = '{Z{[{g{h{i{j{k!#$134ACESTcesu~-~0~=~?~L~O~\\~_';
var booster = 'ABCDEQSUabcdequ~,~0~<~@~L~P~\\~]~^~_~`';
var powerAnimation = '';
var frames = [
  '',//0 neutral frame
  '~A~>~0tqfUD2{i{h~@~=~1udVE1$#"{I{H', //1 idle
  'B65VREA',  //2 power
  '~@~>tD2(\'&%{m{j{i~?~=udB651"{J{I', //3 power
  '~_~P~O~J~;~:~,tUB~b~a~Q~9~+~*~)uqWEA', //4 run
  '~`~M~?~>~=~/T2{k{[~P~J~A~;~:~0~,rdbVB1"{i{Y', //5 run
  '~k~j~Lo_N>~i~Y~Im]M=.', //6 monster 1
  '~p~n~m~l~`~]~\~P~M~=~0~$pi`YOG?92({m{g{^{U{N{J{E{9{4{%~t~s~k~j~b~[~Z~R~K~J~;~%njb^[NKA>;/+!{p{k{`{[{O{K{H{;{8{*', //7 monster 2
  '~o~_~O~N~?~>~#hXPA@8\'{l{]{M~a~Q~L~A~<~$oi_ZYOJ?:*{o{_{N' //8 monster 2
];
var defaultAnimations = {
  i:{kf:'', f:[0]}
}
var heroAnimations = {
  i:{//idle
    kf:hero,//key frame
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