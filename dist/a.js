(function(){
/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // I moved this here from the reset(true) function
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // All variables are kept alive through function closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // Length of the attack stage
      _envelopeLength1, // Length of the sustain stage
      _envelopeLength2, // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = function() {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // I split the reset() function into two functions for better readability
  this.totalReset = function() {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // Full length of the volume envelop (and therefore sound)
    // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = function(buffer, length) {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p['s'] != 1 || p['v'],
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'],
        // Minimum frequency before stopping
        _minFreqency = p['g'],
        // If the phaser is active
        _phaser = p['q'] || p['r'],
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'],
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2,
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // The type of wave to generate
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

    // Damping muliplier which restricts how fast the wave position can move
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample,          // Actual sample writen to the wave
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1;
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
        _period = _maxPeriod;
        if (_minFreqency > 0) {
          _finished = true;
        }
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0;
      if (_periodTemp < 8) {
        _periodTemp = 8;
      }

      // Sweeps the square duty
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

        switch (++_envelopeStage)  {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
        }
      }

      // Sets the volume based on the position in the envelope
      switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0;
          _finished = true;
      }

      // Moves the phaser offset
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0;
      for (var j = 8; j--; ) {
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // Gets the sample from the oscillator
        switch (_waveType) {
          case 0: // Square wave
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // Saw wave
            _sample = 1 - _phase / _periodTemp * 2;
            break;
          case 2: // Sine wave (fast and accurate approx)
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
            break;
          case 3: // Noise
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
        }

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0;
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1;
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

        _superSample += _sample;
      }

      // Averages out the super samples and applies volumes
      _superSample *= .125 * _envelopeVolume * _masterVolume;

      // Clipping if too loud
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
    }

    return length;
  }
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
window['jsfxr'] = function(settings) {
  // Initialize SfxrParams
  synth._params.setSettings(settings);
  // Synthesize Wave
  var envelopeFullLength = synth.totalReset();
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
  var dv = new Uint32Array(data.buffer, 0, 44);
  // Initialize header
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // put total size here
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // size of the following
  dv[5] = 0x00010001; // Mono: 1 channel, PCM format
  dv[6] = 0x0000AC44; // 44,100 samples per second
  dv[7] = 0x00015888; // byte rate: two bytes per sample
  dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // put number of samples here

  // Base64 encoding written by me, @maettig
  used += 44;
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,';
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
  }
  return output;
}

var doc = document;
doc.get = doc.getElementById;
var canvas = doc.get('c');
var canvitas = canvas;
var ctx = canvas.getContext('2d');
var pixelSize = 4;
var i;
var j;
var ppp=16;
var pp1=15;
var dimensions = {w:1024,h:720};
var viewport = {x:0, y:-720, oY:250};
var black = '#000';
var white = '#fff';
var xlevel;

var xAxis=0;
var yAxis=0;

var currentLevel = 'level1';

var zoomFactor =(innerHeight-100)/dimensions.h; 
//var zoomFactor =1; 
canvas.width = dimensions.w*zoomFactor;
canvas.height = dimensions.h*zoomFactor;
ctx.scale(zoomFactor, zoomFactor);
ctx.translate(viewport.x, -viewport.y);

var powers = [];
var enemypowers = [];
//295, 55
var elementColors = [55, 205, 115, 25,99];
//E
var basicColors = ['yellow', '#09F', '#1F0', '#F60', 'purple'];
var enemies = [];
var particles = [];
var platforms = [];
var boosters = [];
var currentEnemy = null;
var elementalNames=['Air', 'Water', 'Earth', 'Fire'];

//set text style
ctx.textBaseline="middle";
ctx.textAlign="center"; 
function setFont(type){
  ctx.font=type?'normal lighter 12px':'normal lighter 20px monospace';
}
setFont();


//requestAnimationFrame
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
}

if (!requestAnimationFrame) {
  requestAnimationFrame = function(callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

ra = requestAnimationFrame;


function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}


function getShader(gl, id) {
  var currentChild=doc.get("2d-"+id+"-shader").firstChild;
  var shader;
  if(id == 'fragment') {
    shader=gl.createShader(gl.FRAGMENT_SHADER);
  }else{
    shader=gl.createShader(gl.VERTEX_SHADER);
  }
  gl.shaderSource(shader, currentChild.textContent);
  gl.compileShader(shader);
  return shader;
}

var c3d=doc.get('canvas3d');
var gl=c3d.getContext('webgl');
gl.tp=gl.texParameteri;
gl.ga=gl.getAttribLocation;
gl.eva=gl.enableVertexAttribArray;
gl.vap=gl.vertexAttribPointer;
gl.AB=gl.ARRAY_BUFFER;
with(gl){
  var s1=getShader(gl, 'vertex');
  var s2=getShader(gl, 'fragment');
  var p=createProgram();
  attachShader(p, s1);
  attachShader(p, s2);
  linkProgram(p);
  useProgram(p);
  var pl=ga(p, 'ap');
  var tcl=ga(p, 'at');
  bindBuffer(AB, createBuffer());
  bufferData(AB, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), DYNAMIC_DRAW);
  eva(tcl);
  vap(tcl, 2, FLOAT, false, 0, 0);
  var txt=createTexture();
  bindTexture(TEXTURE_2D, txt);
  tp(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
  tp(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
  tp(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
  uniform2f(getUniformLocation(p, 'ur'), c3d.width, c3d.height);
  bindBuffer(AB, createBuffer());
  eva(pl);
  vap(pl, 2, FLOAT, false, 0, 0);
  bufferData(AB, new Float32Array([
    0, 0,
    c3d.width, 0,
    0, c3d.height,
    0, c3d.height,
    c3d.width, 0,
    c3d.width, c3d.height]), STATIC_DRAW);
}

// sounds
function getAudio(array){
  var player = new Audio();
  player.src = jsfxr(array);
  setTimeout(function(){player.play()}, 1);
}

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
  var key = e.keyCode|| e.which;
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
//  awfe
// a0412
// w1024
// f4201
// e2140

//  awef
// a0421
// w1042
// e2104
// f4210

//a=0   //purple
//w=1   //azul
//f=2   //orange
//e=3   //green
var elementalMatriz = [[0,4,2,1],
                       [1,0,4,2],
                       [2,1,0,4],
                       [4,2,1,0]];
function getTotalDamage(from, to, damage){
  return elementalMatriz[from][to]*damage/2;
}

var ElementalSkill = function(types, charge){
  var m = this;
  m.elements = types;
  m.charges = [];
  m.locks = [0,0,0,0];
  m.current = m.elements[0];
  m.currentQ = charge;  //current quantity
  for (var i = 0; i < types.length; i++) {
    m.charges.push(charge);
  }

  m.power = function(vy, x, y){
    if(m.charges[m.current]-->0){
      var power = new Power(m.current, 2, 1, x, y,  heroS.direction?13:-13, vy);
      powers.push(power);
      m.updateCurrentQ();
    }else{
      m.charges[m.current]=0;
      m.updateCurrentQ();
    }
  }
  m.lock = function(element){
    m.locks[element] = 1;
  }
  m.updateCurrentQ = function(){
    m.currentQ = m.charges[m.current];
  }
  m.nextElement= function(){
    m.current++;
    if(m.current>3)m.current=0;
  }
  m.draw = function(vx, vy){

    for (var i = 0; i < 4; i++) {
      if(!m.locks[i]){
        ctx.fillStyle = i==m.current&&loop%8==0?'#000':basicColors[i];
        ctx.fillText (""+m.charges[i], vx+40+(i%2==0?35:i==1?69:0), vy-40-(i%2==1?30:i==0?60:0));
      }
    };
    firexx.x = vx+50;
    firexx.y = vy-95;
    firexx.draw();
  }
}

var ElementCell = function(type, energy, x, y){

}
function Particle(x, y, vx, vy, size, color){
  var m = this;
  m.x = x;
  m.y = y;
  m.vx = vx;
  m.vy = vy;
  m.size = size;
  m.color = color;
  m.life = 100;
  m.update = function(){
    m.x += m.vx;
    m.vy += 0.2;
    m.y += m.vy;
    m.size*=1;
    return --m.life<0;
  }

  m.draw = function(){
    ctx.fillStyle = 'hsla('+m.color+','+m.life+'%, '+m.life+'%, '+m.life/100+')';
    ctx.fillRect(m.x, m.y, m.size, m.size);
  }
}

function createParticles(s, force, vx, vy, color){
  for(var i = 0; i < s.data.length; i++) {
    var k = (s.data[i] & 0XF);
    particles.push(
      new Particle(
        s.x+(s.direction?k:15-k)*s.pixelSize,
        s.y+(s.data[i] >> 4)*s.pixelSize,
        ((s.direction?k:15-k)-8)*force+vx,
        ((s.data[i] >> 4)-8)*force+vy-2,
        s.pixelSize,
        color
        )
    );
  }
}
function randomParticles(){
  particles.push(new Particle(-viewport.x+Math.random()*1024,viewport.y+Math.random()*720,0,0.1,2,Math.random()*360));
}
var fire = '{f{g{h{i{u!$%056?@ABFORV`bcefostu~,';
//var air = '{({){*{+{6{7{<{B{D{E{M{V{W{X{^{i{o%*5;FKV[eku~%~/~5~<~=~>~D~H~J~K~S~\\~]~b~n~o~p~q';
//var water = '{j{k{l{u"#$(369>@ABEIUY^`abeis~!~$~+~-~.~/~3~@~A~B';
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
  '~o~_~O~N~?~>~#hXPA@8\'{l{]{M~a~Q~L~A~<~$oi_ZYOJ?:*{o{_{N', //8 monster 2
  '~/~.~-uqecaTR', //9 skull 1
  '~?~>~=~0~,usqdb', //10 skull 2
  '~O~N~M~@~<~0~.~,tr', //11 skull 3
  '~`~_~^~]~P~O~N~M~b~a~Z~Y~R~Q~J~I~B~A~2~1', //12 minion 1
  '~^~N~>~.s{j{i{[{X~a~]~\~Q~M~L~<~0~,uTR{J{I{;{8', //13 elemental,
  '~o~n~m~^~\~O~M~>~=~.~-pF6{3~q~p~k~`~[~P~L~?~<~/~,soVG{U', //14 wizard,
  '~]~Na`5%{2~o~l~^~\~O~M~.p_UF6{V', //15 wizard,
  '~Y~X~:~+X9(~k~j~i~h~$~#8', //16 earth boss
  '~d~c~B~1N-{s~t~s~r~q~@nm.', //17 earth boss
  '.{r2{u{d{c{b', //18 last master
  '{>{3{.{#', //19 grand master
  '{Y{X{J{G{l{e{9{8{*{\'',  //20 
  '{\{U', //21
  '{9{8{*{\'{Y{X{M{J{G{D',  //22
  '{>{3', //23
  '{Y{X{J{G{-{${9{8{.{*{\'{#',  //24
  '{<{5', //25
  '{\{U{9{8{*{\'{Y{X{J{G',  //26
  '{l{e{M{D{<{5{-{$'//27
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
var convertTobyte = function(d){
  var bArray = new Int16Array(ppp);
  for (var i = 0; i < d.length; i++) {
    //var y = data[i] >> 4;       // takes the y index 
    //var x = data[i] & 0XF;      // takes the x index 
    //byteArray[y] |= 1<<15-x;  // create a number of 16bits each bit represents a pixel of the character
    bArray[d[i] >> 4] |= 1<<pp1-(d[i] & 0XF);  // create a number of 16bits each bit represents a pixel of the character
  }
  return bArray;
}
var loadByString= function(sprite){
  var i=0, char=sprite[i];
  var byteArray=[];
  var byte = 0;
  while(char){
    var mod = 0X55;
    if(char[0]=='{'){
      char = sprite[++i];
      mod=0;
    }
    if(char[0]=='~'){
      char = sprite[++i];
      mod=0XAA;
    }
    byteArray.push(char.charCodeAt()+mod-0X21);
    char = sprite[++i]
  }
  return byteArray;
}
var faceMask = loadByString('{%{&{\'{({){*{+{,{5{6{7{8{9{:{;{<{E{F{G{H{I{J{K{L{U{V{W{X{Y{Z{[{\\{e{f{g{h{i{j{k{l{u!"#$%&\'');

var Sprite = function(code, animations){
  var m = this;
  m.byteArray = new Int16Array(ppp);
  m.data = loadByString(code);
  m.frames = [];
  m.iFrame = 0;
  m.byteArray = convertTobyte(m.data);
  m.maxVx = pixelSize*2.2;
  m.accelerationX = 0.25;
  m.pixelSize = 0;
  m.animations = animations||defaultAnimations;
  m.hp = 1; //hitpoints
  m.reset = function(){
    m.color = black;
    m.x=0;
    m.y=-720;
    m.vx=0;
    m.vy=0;
    m.direction = 1;
    m.landed = 0;
    m.canDoubleJump = 0;
  }
  m.reset();
  m.setPixelSize = function(pixelSize){
    m.pixelSize = pixelSize;
    m.height = m.width = m.pixelSize*16;
  }
  m.setPixelSize(pixelSize);

  m.generateFace = function(){
    var data2 = [];
    var byteInfo = convertTobyte(m.data);
    var byteMask = convertTobyte(faceMask);
    for(var j = 0; j < ppp; j++) {
      var byteP = byteInfo[j]&byteMask[j];
      for (var i = 0; i < ppp; i++) {
        if(1<<(pp1-i)&byteP){
         data2.push(j*ppp+i);
        }
      }
    }
    m.faceSprite = data2;
  }
  m.generateFace();

  m.rotate = function(){
    var data2 = [];
    for (var i = 0; i < ppp; i++) {
      for (var j = 0; j < ppp; j++) {
        if(m.byteArray[i] & 1<<pp1-j){
          data2.push(j*ppp+pp1-i);
        }
      }
    }
    m.data = data2;
    m.byteArray = convertTobyte(data2);
  }
  m.addFrame = function(data){
    m.frames.push(convertTobyte(data));
    m.iFrame = m.frames.length-1;
  }
  m.fall = function(){
    m.y += m.vy;
    if(m.vy<0){
      m.landed = 0;
    }
  }
  m.animate = function(){
    if(++m.iFrame>=m.frames.length){
      m.iFrame=0;
    }
    if(typeof(m.frames[m.iFrame])=='string'){
      return m.setAnimation(m.frames[m.iFrame]);
    }
    var data2 = [];
    for(var j = 0; j < ppp; j++) {
      m.byteArray[j] = m.byteArray[j]^m.frames[m.iFrame][j];
      for (var i = 0; i < ppp; i++) {
        if(1<<(pp1-i)&m.byteArray[j]){
         data2.push(j*ppp+i);
        }
      }
    }
    m.data = data2;
  }
  m.xi = function(){
    return m.x+m.pixelSize*5;
  }
  m.xpi = function(){
    return m.x+m.pixelSize;
  }
  m.xf = function(){
    return m.x+m.pixelSize*11;
  }
  m.xpf = function(){
    return m.x+m.pixelSize*14;
  }
  m.yi = function(){
    return m.y+m.pixelSize*2;
  }
  m.yil = function(){
    return m.y+m.pixelSize*12;
  }
  m.yf = function(){
    return m.y+m.pixelSize*16;
  }
  m.accelerateY = function(dvy){
    //if(m.vy>0)m.setAnimation('jump');
    m.vy+=dvy;
    if(m.vy>m.pixelSize*3){
      m.vy = m.pixelSize*3;
    }
  }
  m.land = function(yf){
    if(!m.landed)m.setAnimation('i');
    m.vy = 0;
    m.landed = 1;
    m.canDoubleJump = 1
    m.downed = 0;
    m.y = yf-m.pixelSize*15;
  }
  m.left = function(){
    if(m.vx>0)m.vx=0;
    m.vx-=m.accelerationX;
    if(m.landed) m.setAnimation('r');
    if(m.vx < -m.maxVx) m.vx = -m.maxVx;
    m.direction = 0;
  }
  m.right= function(){
    if(m.vx<0)m.vx=0;
    m.vx+=m.accelerationX;
    if(m.landed) m.setAnimation('r');
    if(m.vx > m.maxVx) m.vx = m.maxVx;
    m.direction = 1;
  }
  m.forward = function(){
    m.direction?(m.x+17*pixelSize+m.vx<xlevel.w?m.right():m.stopX()):m.x+m.vx>0?m.left():m.stopX();
  }
  m.turn = function(){
    m.direction = !m.direction;
  }
  m.stopX = function(){
    if(m.vx!=0){
      m.vx=0;
      m.setAnimation('i');
    }
  }
  m.jump= function(){
    if(m.landed||m.canDoubleJump){
      m.vy=-m.pixelSize*3;
      if(m.vy<-20)m.vy = -20;
      if(!m.landed)
        m.canDoubleJump = 0;
      m.landed = 0;
      m.setAnimation('j');
      return true
    }
  }
  m.update= function(){
    m.fall();
    m.x += m.vx;
  }
  m.updateX= function(){
    m.x += m.vx;
  }
  m.updateY= function(){
    m.y += m.vy;
  }
  m.draw= function(){
    ctx.fillStyle = m.color;
    for(var i = 0; i < m.data.length; i++) {
      //var y = array[i] >> 4;
      //var x = array[i] & 0XF;
      var k = (m.data[i] & 0XF)
      ctx.fillRect(m.x+(m.direction?k:15-k)*m.pixelSize, m.y+(m.data[i] >> 4)*m.pixelSize, m.pixelSize, m.pixelSize);
    }
  }
  m.drawFace= function(posx, posy){
    ctx.fillStyle = m.color;
    for(var i = 0; i < m.faceSprite.length; i++) {
      //var y = array[i] >> 4;
      //var x = array[i] & 0XF;
      var k = (m.faceSprite[i] & 0XF)
      ctx.fillRect(posx+(m.direction?k:15-k)*9, posy+(m.faceSprite[i] >> 4)*9, 9, 9);
    }
  }
  m.setAnimation = function(name){
    if(m.currentAnimation == name||!m.animations[name]) return;
    m.currentAnimation = name;
    m.frames = [];
    var animation = m.animations[name].f;
    m.byteArray = convertTobyte(loadByString(m.animations[name].kf));
    for (j = 0; j < animation.length; j++) {
      var ha = frames[animation[j]];
      if(animation[j]==-1){
        m.iFrame = m.frames.length;
        return m.frames.push('i');
      }
      m.addFrame(loadByString(ha));
    }
  }
  m.hit = function(damage){
    m.hp-=damage;
    if(m.hp<0) m.hp=0;
    return m.hp==0;
  }
  m.bounds = function(){
    return {
      left:m.xi(),
      right:m.xf(),
      top:m.yi(),
      bottom:m.yf(),
    }
  }
}


var Platform = function(x,y,width){
  var m = this;
  m.x = x;
  m.y = y;
  m.width = width;
  m.collide = 1;
  m.collides = function(sprite){
    if((sprite.xi()>m.x&&sprite.xi()<m.x+m.width||
      sprite.xf()>m.x&&sprite.xf()<m.x+m.width||
      sprite.xi()<m.x&&sprite.xf()>m.x+m.width)&&
      (m.y>sprite.yil()&&m.y+5<sprite.yf())&&
      (sprite.vy>=0)){
      m.collide = 1;
      sprite.land(y);
    }else{
      m.collide = 0;
//      heroS.landed = 0;
    }
  },
  m.draw = function(){
    //ctx.fillStyle=m.collide?'#700':'#668';
    //ctx.fillRect(m.x, m.y, m.width, -xlevel.h+dimensions.w);
    
    ctx.fillRect(m.x, m.y, m.width, 5);
  }
}
var Power = function(type, pixelSize, damage, x, y, vx, vy){
  var m = this;
  m.type = type;
  m.data = fire;
  //m.data = loadByString(fire);
  m.sprite = new Sprite(m.data);
  m.outside = 0;
  m.color = elementColors[type];
  m.sprite.color =basicColors[type];
  m.sprite.x = x;
  m.sprite.y = y;
  m.sprite.setPixelSize(pixelSize);
  m.sprite.vx = vx;
  m.sprite.vy = vy;
  m.sprite.direction = vx>0;
  m.damage = damage;
  m.del = 0;
  getAudio([type,0.0066,0.1909,0.1663,0.1679,0.5182,,,-0.1129,0.2115,0.6703,-0.7826,-0.1723,0.2605,-0.0009,0.3423,0.0018,-0.4875,0.2872,-0.0083,0.1956,0.7835,-0.4082,0.59])
  
  m.collides = function(){
    for (var i = enemies.length - 1; i >= 0; i--) {
      var sprite = enemies[i].sprite;
      if(intersectRect(sprite.bounds(), m.sprite.bounds())){
        //m.sprite.color = white;
        enemies[i].hit(m.type, m.damage, m.sprite.direction);
        m.del = 1;
        createParticles(m.sprite, 2, m.sprite.vx/2, -3, m.color);
        //make me particles
      }
    }
  }

  m.collidesHero = function(bounds){
    //ctx.strokeRect(heroS.xpi(), heroS.y, heroS.xpf()-heroS.xpi() ,heroS.yf()-heroS.yi())
    //ctx.strokeRect(m.sprite.xpi(), m.sprite.y, m.sprite.xpf()-m.sprite.xpi() ,m.sprite.yf()-m.sprite.yi())
    if(intersectRect(bounds, m.sprite.bounds())){
      //m.sprite.color = white;
      //***enemies[i].hit(m.type, m.damage);
      myhero.hit(m.type, m.damage, m.sprite.direction);
      m.del = 1;
      createParticles(m.sprite, 2, m.sprite.vx/2, -3, m.color);
      //make me particles
    }
  }
  
  m.update= function(){
    m.sprite.updateX();
    m.sprite.updateY();
    m.outside = m.sprite.x>xlevel.w || m.sprite.x<-10;
  }
  
  m.animate = function(){
    m.sprite.rotate()
    //if(m.type==1)m.sprite.rotate()
    //if(m.type==2)m.sprite.rotate()
    //if(m.type==3)m.sprite.rotate()
  }
}
var Booster = function(type, quantity, x, y){
  var m = this;
  m.type = type;
  m.quantity = quantity;
  m.sprite = new Sprite(booster);
  m.color = elementColors[type];
  m.sprite.color = basicColors[type];
  m.sprite.x = x;
  m.sprite.y = y;
  m.sprite.vy = 0.5;
  m.sprite.landed = 0;
  m.times = 256;
  m.del=0;
  m.update = function(){
    var cond = loop%32==0;
    if(!m.sprite.landed){
      m.sprite.updateY();
    }else{
      m.del=m.times--==0;
      cond = loop%~~(m.times/16)==0; 
    }
    m.sprite.color=cond?white:basicColors[type];
  }
  m.collidesHero = function(bounds){
    if(intersectRect(bounds, m.sprite.bounds())){
      //m.sprite.color = white;
      //***enemies[i].hit(m.type, m.damage);
      myhero.charge(m.type, m.quantity);
      m.del = 1;
      createParticles(m.sprite, 0, 0, -4, m.color);
      //make me particles
    }
  }
}

function createBooster(type, quantity, x, y){
  boosters.push(new Booster(type, quantity, x, y));
}
var monster0 = '{\'{({){*{7{8{9{:{G{H{I{J{W{X{Y{Z{e{f{g{h{i{j{u!"#$%./2367>?BCFGHRSbcrs~-~.~/~0~1~2~=~>~?~@~A~B~I~J~K~L~Q~R~Y~Z~[~\\~a~b';
var monster1 = '{3{4{8{9{B{C{D{E{H{I{J{K{S{T{U{V{X{Y{[{\\{d{e{f{h{i{l{u!$%&\'1267BCQRSTUabcflpqrst~"~\'~*~+~,~.~8~9~:~;~I~J';
var monster2 = "{&{'{({){*{5{6{7{8{:{;{F{G{H{K{O{V{W{X{Y{Z{[{_{`{h{i{j{k{n{o{p!\"#$%)*+./013567:;=ABCDEHIJKMSZ[]^abcdejmnqsu~%~-~.~/~;~<~@~A~I~J~K~Q~R~Y~Z~[~a~b~i~q~r~s~t";
var monster3 = '{4{5{6{7{8{G{H{I{U{V{W{X{Y{g{h"123@BCDGORUV_bors~,~/~<~?~L~P~[~`~k~l~p~q';
var monster4 = '';
var monster5 = '';
var boss1 = '{D{L{S{T{V{W{X{Y{Z{\\{]{c{d{e{f{g{h{i{j{k{l{m{t{u#&\'0123456@ABCDEFQRSTUabcderst';
var boss4 = '{&{\'{({){*{5{6{7{8{9{:{;{E{H{K{U{X{[{e{f{j{k{u!%&./012345678=ABCDEIMRSTY]^bcdhimnrst~#~$~,~-~.~/~0~;~<~@~A~J~K~Q~R~Z~[~a~b~h~i~j~k~q~r~s~t';
var boss5 = '{6{:{E{F{I{J{K{V{W{X{Y{Z{[{b{c{d{g{h{i{k{s{t{u#$%&/012345@ABCDEFGOQRSTUX_cdimostu~"~$~)~-~.~/~0~3~>~?~M~N~]';
var boss6 = '{\'{*{4{7{8{9{:{={D{E{H{I{L{M{U{V{[{\\{e{f{g{h{i{j{k{l{s!"#$%&).13469?@CDGHSTbcderu~,~-~0~1~<~A~K~L~Q~R~[~\\~a~b';

var elemental0 = '{8{;{H{I{J{K{Y{Z{g{k"#$%&123456@CEPRSTVW`bdru~,~0~<~?~L~M~O~P~Q~\\~]~_~`~a';
var superAggressive = 'lgajdag10jdsajd';

var monsterSprites={
  A0:monster0,
  A1:monster1,
  A2:monster2,
  A3:monster3,
  A4:boss1,
  A5:boss6,//only one sprite for the grand master
  A6:hero,
  W0:monster0,
  W1:elemental0,
  W2:monster2,
  W3:monster3,
  W4:boss1,
  W5:hero,//only one sprite for the grand master
  W6:hero,
  E0:monster0,
  E1:elemental0,
  E2:monster2,
  E3:monster3,
  E4:boss4,
  E5:hero,//only one sprite for the grand master
  E6:hero,
  F0:monster0,
  F1:monster1,
  F2:monster2,
  F3:monster3,
  F4:boss1,
  F5:hero,//only one sprite for the grand master
  F6:hero,
}

var monsterAnimations = {
  B0: {
    i:{
      kf:monster0,
      f:[0,0,0,12,0,12]
    }
  },
  B1: heroAnimations,
  B2: {
    i:{
      kf:monster2,
      f:[0,6,7,8,8,7,6,0]
    }
  },
  B3: {
    i:{
      kf:monster3,
      f:[0,14,0,0,0,14]
    }
  },
  B4: {
    i:{
      kf:boss1,
      f:[9,0,10,11,0,0,11,10,9,0]
    }
  },
  B5: {
    i:{
      kf:boss6,
      f:[19,0,0,20,21,22,23,0,0,0,24,25,26,27,0,0,0]
    }
  },
  B6: heroAnimations,
}

for (var i = 0; i < 7; i++) {
  monsterAnimations['A'+i]= monsterAnimations['B'+i];
  monsterAnimations['W'+i]= monsterAnimations['B'+i];
  monsterAnimations['E'+i]= monsterAnimations['B'+i];
  monsterAnimations['F'+i]= monsterAnimations['B'+i];
}
monsterAnimations.A1 = {
  i:{
    kf: monster1,
    f:[0]
  }
}
monsterAnimations.F1 = monsterAnimations.A1;
monsterAnimations.E1 = {
  i:{
    kf: elemental0,
    f:[0,0,0,0,13]
  }
}
monsterAnimations.W1 = monsterAnimations.E1;

monsterAnimations.E4 = {
   i:{
    kf: boss4,
    f:[0,0,16,0,0,16,0,0,17,0,0,17]
  } 
}

monsterAnimations.F4 = {
   i:{
    kf: boss5,
    f:[0,0,18]
  } 
}
monsterAnimations.W4 = monsterAnimations.F4;
// nameCode     1 digit
// type         1 digit
// vx           1 hexa
// hp           2 hexa
// pixelSize    1 digit (+4)
// coldown      1 hexa (*3)
// triggerType  1 digit
// actionpipe   n characters
var monsterMoves = {
  a: 'ljlw90taw90', //jump wait attack
  b: 'lf80sw30asw30t', // move and attack
  c: 'lg60asw5aw5r20s', // follow and attack
  d: 'ljdsw60ajdw30at',
  e: 'ltja30w20', //jump aggresive attack
  f: 'ltg30a30w20', //follow aggresive attack
  m: 'w20hk20f9w9m20tas', // fly
  n: 'ljw20tg60stf30asw20',  //
  o: 'lja10lf30jla10t',  // master earth boss
  p: 'w15hk30af15am30tw15am30af15k30at',
  q: 'w15thk30af15am30tw15am30f15k30a',
  r: 'ljda3jsw40hk20a5tf30sxa3'
}
monsterMoves.z = monsterMoves.m+'zx'+monsterMoves.e+'z'+monsterMoves.c+'z'+monsterMoves.d+'jw20z';
//vx,hp,psize,coldown,trigger
var monsterAttributes = {
  minion: '2020F0',
  elemental: '3042E2',
  monster: '3083C1',
  wizard: '406291',
  advanced: '304361',
  boss1: '308490',
  boss2: '416490',
  boss3: '425590',
  boss4: '330730',
  boss5: '420551',
  boss6: '750621',
  boss7: '820811',
}
// nameCode     1 digit
// type         1 digit
var monsterBook = {
  a0: '00'+monsterAttributes.minion,
  a1: '01'+monsterAttributes.minion,
  a2: '02'+monsterAttributes.minion,
  a3: '03'+monsterAttributes.minion,
  b0: '10'+monsterAttributes.elemental,
  b1: '11'+monsterAttributes.elemental,
  b2: '12'+monsterAttributes.elemental,
  b3: '13'+monsterAttributes.elemental,
  c0: '20'+monsterAttributes.monster,
  c1: '21'+monsterAttributes.monster,
  c2: '22'+monsterAttributes.monster,
  c3: '23'+monsterAttributes.monster,
  d0: '30'+monsterAttributes.wizard,
  d1: '31'+monsterAttributes.wizard,
  d2: '32'+monsterAttributes.wizard,
  d3: '33'+monsterAttributes.wizard,
  e0: '10'+monsterAttributes.advanced,
  e1: '11'+monsterAttributes.advanced,
  e2: '12'+monsterAttributes.advanced,
  e3: '13'+monsterAttributes.advanced,
  f0: '20'+monsterAttributes.advanced,
  f1: '21'+monsterAttributes.advanced,
  f2: '22'+monsterAttributes.advanced,
  f3: '23'+monsterAttributes.advanced,
  x1: '23'+monsterAttributes.boss1,
  x2: '10'+monsterAttributes.boss2,
  x3: '40'+monsterAttributes.boss3,
  x4: '42'+monsterAttributes.boss4,
  x5: '41'+monsterAttributes.boss5,
  x6: '43'+monsterAttributes.boss5,
  x7: '50'+monsterAttributes.boss6,
  z1: '60'+monsterAttributes.boss7,
  z2: '61'+monsterAttributes.boss7,
  z3: '62'+monsterAttributes.boss7,
  z4: '63'+monsterAttributes.boss7,
}

var generateMonster = function(code, x, actionpipe){
  //nameCode, type, vx, actionpipe, hp, pixelSize, coldown, triggerType
  //7 posibilites, 4 posiblities, x 99 posiblities, vx 16 posibilites, string *, hp 256 posibilites, pixelSize, coldown, triggerType
  //1digit, 1digit, 1hexa, array, 2hexa, 1digit, 1hexa, 1digit
  //=,=,*100,=,at the end,
  var nameCode = code[0];
  var type = code[1];
  var vx = parseInt(code[2],16);
  var hp = parseInt(code[3]+code[4],16);
  var pSize = parseInt(code[5])+4;
  var coldown = parseInt(code[6],16)*3;
  var triggerType = code[7];


  return new Enemy(nameCode, type, x*100, vx, actionpipe, hp, pSize, coldown, triggerType);
}

var monsterNames=['Minion', 'Elemental', 'Monster', 'Wizard', 'Master', 'Grand Master', 'Gran Elemental'];

var Enemy = function(nameCode, type, x, vx, actionpipe, hp, pixelSize, coldown, triggerType){
  var m = this;
  //m.type = type;
  m.name = elementalNames[type]+' '+monsterNames[nameCode];
  m.damage = parseInt(nameCode)+1;
  m.color = elementColors[type];
  //load sprite depending on nameCode and type
  m.monsterCode = elementalNames[type][0]+nameCode;
  m.sprite = new Sprite(monsterSprites[m.monsterCode], monsterAnimations[m.monsterCode]);
  m.sprite.color = 'hsl('+m.color+',100%, 50%)';
  m.sprite.setAnimation('i');
  m.sprite.setPixelSize(pixelSize);

  m.sprite.maxVx = vx||m.pixelSize*2.2;
  m.sprite.x = x;
  m.sprite.y = -720;
  m.skills = new ElementalSkill([type]);
  m.maxhp = hp;
  m.sprite.hp = hp;
  m.coldown = coldown;
  m.maxColdown = coldown;
  m.triggerType = triggerType||2;
  m.ghostTime = 100;
  m.del = 0;
  //action options:
  //f: forward
  //t: change direction
  //j: jump
  //a: main attack
  //b: second attack
  //c: third attack
  //w: wait
  //l: lock until land, do nothing
  //d: move forward until land
  //g: go for the hero
  //r: run away from the hero
  //h: fly
  //u: up
  //n: down
  //k: diagonal
  //m: transversal
  //x: restore gravity
  //z: change element
  
  m.setActionPipe = function(actionpipe){
    var newPipe = '';
    for (var i = 0; i < actionpipe.length; i++) {
      var action = actionpipe[i];
      var times = parseInt(actionpipe.substring(i+1,i+4));
      if(!times){
        newPipe+=action;
        continue;
      }
      i+= (''+times).length;
      for (var j = 0; j < times; j++) {
        newPipe+=(action);
      }
    }
    m.actionpipe = newPipe;
  }
  m.setActionPipe(actionpipe||'f60taw20');
  //m.setActionPipe('lf30sw10tjl');
  //m.setActionPipe('lf60sw10tf60sw10ta');
  m.actionIndex = 0;

  m.attack1 = function(){
    if(m.coldown<=0){
      m.sprite.setAnimation('p');
      //var vy = 0;
      //m.skills.power(vy);
      var vx = -(m.sprite.x - heroS.x);
      var vy = -(m.sprite.y - heroS.y);
      var h = Math.sqrt(vx*vx+vy*vy);
      vx/=h;
      vy/=h;
      var power = new Power(m.skills.current, m.sprite.pixelSize/3, m.damage, m.sprite.x+8*3, m.sprite.y, 3*vx, 3*vy);

      enemypowers.push(power);
      m.coldown = m.maxColdown;
      //power.sprite.vy=vy;
      //m.coldown = 16;
    }
  }
  //follow the hero
  m.follow = function(){
    m.sprite.direction = m.sprite.x<heroS.x;
    m.sprite.forward();
  }
  //run away from the hero
  m.away = function(){
    m.sprite.direction = m.sprite.x>heroS.x;
    m.sprite.forward();
  }
  m.actions = {
    f: m.sprite.forward,
    t: m.sprite.turn,
    j: m.sprite.jump,
    m: function(){},
    a: m.attack1,
    b: m.attack2,
    c: m.attack3,
    s: m.sprite.stopX,
    w: function(){},
    l: function(){
      if(!m.sprite.landed)
        m.actionIndex--;
    },
    d: function(){
      if(!m.sprite.landed){
        m.actionIndex--;
        m.sprite.forward();
      }else{
        m.sprite.stopX();
      }
    },
    g: m.follow,
    r: m.away,
    h: function(){
      m.sprite.fall =function(){};
    },
    x: function(){
      m.sprite.fall =function(){
        m.sprite.y += m.sprite.vy;
        if(m.sprite.vy<0){
          m.sprite.landed = 0;
        }
      }
    },
    u: function(){
      m.sprite.y-=3;
    },
    n: function(){
      m.sprite.y+=3;
    },
    k: function(){
      m.actions.u();
      m.sprite.forward();
    },
    m: function(){
      m.actions.n();
      m.sprite.forward();
    },
    z: function(){
      m.skills.nextElement();
      console.log('nx', m.skills.current);
      m.color = elementColors[m.skills.current];
      m.sprite.color = 'hsl('+m.color+',100%, 50%)';      
    }
  } 

  //do the next action in the pipe
  m.nextAction = function(){
    var action = m.actionpipe[m.actionIndex];
    m.actions[action]();
    if(++m.actionIndex>=m.actionpipe.length) m.actionIndex = 0;
  }

  m.update = function(){
    //m.follow();
    //m.away();
    m.nextAction();
    //evaluar
//    m.attack();
    m.sprite.update();
    if(--m.coldown<0) m.coldown=0;
    if(m.sprite.y>400) m.del = 1;
  }

  //triggers coded in an array
  // m.trigger[0] = create energy booster
  // m.trigger[1] = create health booster
  // m.trigger[2] = create random booster 1/10 to drop life
  // m.trigger[3] = hummm
  m.triggers = [
    function(){
      createBooster(m.skills.current, m.maxhp,m.sprite.x, m.sprite.y);
    },
    function(){
      createBooster(4, m.maxhp, m.sprite.x, m.sprite.y);
    },
    function(){
      if(~~(Math.random()*10)==0)
        m.triggers[1]();
      else
        m.triggers[0]();
    },
    function(){
      console.log('otra cosa')
    }
  ];
  m.trigger = function(event){
    m.triggers[m.triggerType]();
  }

  m.hit = function(type, damage, direction){
    //damage =getTotalDamage(type, m.skills.current, damage) ;
    var totalDamage = getTotalDamage(type, m.skills.current, damage);
    m.sprite.x+=(direction?1:-1)*totalDamage*(10-m.damage);
    if(totalDamage==0){
      getAudio([2,0.09,0.04,0.19,0.12,0.13,0.08,-0.6065,-0.82,0.07,0.85,,,,,0.99,-1,-0.86,1,0.74,0.09,0.18,-1,0.5])
    }else{
      getAudio([type,,0.0949,,0.2521,0.4777,,-0.6065,,,,,,,,,,,1,,,0.216,,(totalDamage/(2*damage))])
    }
    if(m.sprite.hit(totalDamage)&&!m.del){
      m.del = 1;
      //make me particles
      createParticles(m.sprite, damage, 0, 0, m.color);
      //create a new element cell to drop out
      m.trigger('death');
      getAudio([3,0.09,0.2099,0.99,0.5199,0.62,0.05,-0.4199,-0.2,,0.1099,,,,,0.5984,0.5199,-0.0849,1,,,,,0.5])
      //enemies.push(new Enemy(~~(Math.random()*4), new Sprite(hero)));
    }
    currentEnemy = m;
  }

  m.drawAvatar = function(vx, vy){
    ctx.fillStyle=white;
    ctx.fillText(m.name, vx-120, vy+20);
    ctx.fillStyle=loop%16==0?black:'yellow';
    ctx.fillRect(vx-335, vy+35, 300,8);
    ctx.fillStyle = '#300';
    ctx.fillRect (vx-334, vy+36, 300*(1-m.sprite.hp/m.maxhp)-2,6);
    if(!m.del||loop%8==0)
      m.sprite.drawFace(vx-135, vy+50);
  }

}
var xf = 0;
var yf = 0;
var platformFunctions = {
  a: function(i, y, m, factor){
    return -y+yf;
  },
  b: function(i, y, m, factor){
    return -y+yf +m*(i-xf);
  },
  c: function(i, y, m, factor){
    var grad = (i/factor-xf)%(Math.PI*2);
    return -y+yf+200*m*(Math.cos(grad));
  },
  d: function(i, y, m, factor){
    var grad = (i-xf)%(Math.PI*2);
    return -y+yf+200*m*(Math.tan(grad));
  },
  e: function(i, y, m, factor){
    return -y+yf -m*(i-xf);
  },
  f: function(i, y, m, factor){
    var grad = (i-xf)%(Math.PI*2);
    return -y+yf+200*m*(Math.sin(grad*grad));
  },
  g: function(i, y, m, factor){
    return 0.005*platformFunctions.b(i,y,m, factor)*platformFunctions.c(i,y,m, factor);
  },
  h: function(i,y,m,factor){
    return -y+yf+0.005*m*(i-xf-650)*(i-xf-650);
  },
  i: function(i,y,m,factor){
    return -y+yf+800+0.005*m*(i-xf-400)*(i-xf-400);
  },
  v: function(i, y, m, factor){
    return platformFunctions.a(i,y,m, factor)*(((i-xf)/factor)%3==0?1:1000);
  },

  w: function(i, y, m, factor){
    return platformFunctions.c(i,y,m, factor)*(((i-xf)/factor)%3==0?1:1000);
  },
  x: function(i, y, m, factor){
    return platformFunctions.c(i,y,m, factor)*(((i-xf)/factor)%2==1?1000:1);
  }

}

var Level = function(width, enemiesVector, factor, platforms, pendiente, title, backG){
  xf = 0;
  yf=0;
  var m = this;
  m.w = width;
  m.h = 0;
  m.title = title;
  m.enemiesVector = enemiesVector;
  m.totalEnemies = m.enemiesVector.length;
  m.remainingEnemies = 0;
  m.count = 0;
  //m.points = [];
  m.factor = factor;
  //var montains = +20*(2*Math.sin(i/3));
  //var imposible climbing = -i/2+30*(2*Math.tan(i));
  //var y = -20*(2*Math.sin(i/3));
  m.generateLevel = function(functionArray, pendiente){
    var currentIteration = 0;
    var functionIndex = 0;
    var currentFunction = functionArray[0];
    platforms = [];
    for (var i = 0; i <= m.w; i+=m.factor) {
      //var y = -i-20*(Math.sin(i/4));
      //var y = -i/4+20*(2*Math.tan(i));
      //var y = -40;
      var y = platformFunctions[currentFunction](i, 0, pendiente, m.factor);
      m.h=y<m.h?y:m.h;
      platforms.push(new Platform(i, y, m.factor));
      //m.points.push({x:i,y:300+(m.factor)*(Math.sin(i)-Math.cos(i))});
      if(++currentIteration==functionArray[functionIndex+1]){
        currentIteration-=functionArray[functionIndex+1];
        functionIndex+=2;
        currentFunction = functionArray[functionIndex];
        yf = y;
        xf = i;
      }
    };
  }
  m.generateLevel(platforms, pendiente);
  m.backG = backG; 
  m.draw = function(vx, vy){
    m.count++;
    backG();
    var index = ~~(vx/m.factor);
    if(index<0){index=0;}
    var limit = index + 1+~~(dimensions.w/m.factor);
    if(limit>=platforms.length){limit=platforms.length-1;}
    ctx.fillStyle='#A4A';
    for(i = index; i <= limit; i++) {
      platforms[i].draw();
    }

    ctx.fillStyle=white;
    ctx.fillText(m.remainingEnemies+'/'+m.totalEnemies, vx+900, vy+650);

  }
  m.onEnemyDied = function(){
    if(++m.remainingEnemies==m.totalEnemies){
      //drop the portal
      setTimeout(nextLevel,2000);
    }
  }

  // when the player reach specific position
  m.onPlayerX = function(x){
    if(m.count<60||m.enemiesVector.length==0) return;

    var enemy = m.enemiesVector[0];
    if(x+dimensions.w-300>enemy.sprite.x){

      enemy.sprite.y= viewport.y;
      enemies.push(enemy);
      m.enemiesVector.splice(0,1);
    }
  }

  m.collides = function(sprite){
    var index = ~~(sprite.xi()/m.factor)-1;
    if(index<0)index=0;
    var limit = ~~(sprite.xf()/m.factor)+1;
    if(limit>=platforms.length) limit = platforms.length-1;
    for(i = index; i <= limit; i++) {
      platforms[i].collides(sprite);
    }
  }
}

var LevelGenerator = function(level){
  var codeMonsters = level.codeMonsters;
  var platformFunctions = level.plats;
  var monsters = [];
  for (var i = 0; i < codeMonsters.length; i++) {
    var codeMonster = codeMonsters[i];
    var type = codeMonster[0]+ codeMonster[1];
    var moves = codeMonster[2];
    var hp = parseInt(codeMonster.substring(3));
    monsters.push(generateMonster(monsterBook[type], hp, monsterMoves[moves]));
  }
  var m = myhero;
  if(level.locks) m.lock(level.locks);
  if(level.skill){
    m.selectSkill(level.skill);
    m.currentColor = elementColors[m.skills.current];
    m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
  }
  return new Level(level.width, monsters, level.factor, platformFunctions, level.pendiente, level.title, level.backG);
  
}
var snowBack = function(){
  randomParticles();
}
var blackBack = function(){
  ctx.fillStyle='#002';
  ctx.fillRect(-viewport.x,yAxis+viewport.y,dimensions.w,dimensions.h);
  snowBack();
}
var greenBack = function(){
  ctx.fillStyle='#121';
  ctx.fillRect(-viewport.x,yAxis+viewport.y,dimensions.w,dimensions.h);
  particles.push(new Particle(-viewport.x+Math.random()*1024,viewport.y+Math.random()*720,4,0,1,Math.random()*360));
}
var blueBack = function(){
  ctx.fillStyle='#202';
  ctx.fillRect(-viewport.x,yAxis+viewport.y,dimensions.w,dimensions.h);
  particles.push(new Particle(-viewport.x+Math.random()*1024,viewport.y+Math.random()*720,9,-10,2,30));
}
var stormLoop = 0;
var stormBack = function(){
  stormLoop++;
  ctx.fillStyle='#000';
  if(stormLoop%420==0||stormLoop%421==0||stormLoop%424==0||stormLoop%425==0||stormLoop%428==0||stormLoop%429==0||stormLoop%430==0||stormLoop%431==0){
    ctx.fillStyle='#555';
    if(stormLoop%420==0)
      getAudio([3,0.1135,0.5,0.6231,0.6654,0.0449,,0.6264,-0.6229,-0.1508,0.8529,-0.5802,0.874,0.2927,0.0184,0.7343,-0.2326,-0.0537,0.4766,0.4925,0.0156,0.0633,-0.8909,0.4])
  }
  ctx.fillRect(-viewport.x,yAxis+viewport.y,dimensions.w,dimensions.h);
  particles.push(new Particle(-viewport.x+Math.random()*1024,viewport.y+Math.random()*720,0,0,2,Math.random()*180));
}
var levels = {
  level1: {
    codeMonsters: ['a3b4','a3b9','a3b12', 'a3b15', 'a1b24', 'a1b27', 'a1b30', 'a1b35'],
    plats: ['a', 10,'b', 20,'a', 10, 'b', 7,'a',15, 'w', 15, 'a', 15, 'b',15, 'a',30],
    width: 3700,
    factor: 28,
    pendiente: -0.1,
    title: 'The Beginning',
    nextl:'boss1',
    locks:[0,2],
    skill:1,
    backG: function(){
      ctx.ft('      S         ',xAxis+200, yAxis-300);
      ctx.ft('       ->                ',xAxis+600, yAxis-200);
      ctx.ft('      SPACE        ',xAxis+1800, yAxis-300);
      ctx.ft('      D                  ', xAxis+2600, yAxis-220);
      ctx.ft('                    ALL        ', xAxis+3400, yAxis-320);
      ctx.fillStyle=white;
      ctx.ft('press   to shoot',xAxis+200, yAxis-300);
      ctx.ft('press     to move forward',xAxis+600, yAxis-200);
      ctx.ft('Press   to change element', xAxis+2600, yAxis-220);
      ctx.ft('press       to jump',xAxis+1800, yAxis-300);
      ctx.ft('You must to destroy     enemies', xAxis+3400, yAxis-320);
    }
  },
  boss1: {
    codeMonsters:['x1n4'],
    plats:['c',70],
    width: 1024,
    factor: 20,
    pendiente: -0.05,
    title: 'Fire Skeleton',
    nextl:'level2',
    locks:[0,2],
    skill:1,
    backG:function(){
      ctx.ft('            BOSS!', xAxis+400, yAxis-350);
      ctx.fillStyle=white;
      ctx.ft('Destroy the     ', xAxis+400, yAxis-350);
    }
  },
  level2: {
    codeMonsters: ['a0b4','a2b9','a2b12', 'a0b15', 'a2b18', 'a0b27', 'a2c30', 'a0c35', 'a2c40', 'a0c45'],
    plats: ['a',20,'b', 15,'a', 20,'b', 15, 'a', 7,'v',21, 'a',10, 'b', 22, 'a', 100],
    width: 4800,
    factor: 27,
    pendiente: -0.3,
    title: 'The Gate',
    nextl:'boss2',
    locks:[1,3],
    skill:2,
    backG:function(){
      ctx.ft('         VIER                                    ', xAxis+400, yAxis-350);
      ctx.ft('      D                                  ', xAxis+1600, yAxis-240);
      ctx.ft('      SPACE                                ', xAxis+2600, yAxis-380);
      ctx.ft('             charges                   ', xAxis+4200, yAxis-240);
      ctx.fillStyle=white;
      ctx.ft('With the      stone you can control the elements ', xAxis+400, yAxis-350);
      ctx.ft('Press   to change to the previous element', xAxis+1600, yAxis-240);
      ctx.ft('Press       two times to make a double jump', xAxis+2600, yAxis-380);
      ctx.ft('Enemies drop        for element energy', xAxis+4200, yAxis-240);
    }
  },
  boss2: {
    codeMonsters:['x2m4'],
    plats:['c',30],
    width: 1024,
    factor: 37,
    pendiente: -0.05,
    title: 'Fire Dragon',
    nextl:'level3',
    locks:[1,3],
    skill:2,
    backG:function(){
      ctx.ft('      up                flying        ', xAxis+400, yAxis-350);
      ctx.fillStyle=white;
      ctx.ft('Press    arrow to shoot        enemies', xAxis+400, yAxis-350);
    }
  },
  level3: {
    codeMonsters: ['b1b4','b1a9','b2a12', 'b2a15', 'b3m20', 'b3m25', 'b0m35', 'b0m40', 'c1a47', 'c2a55', 'b2a70', 'c3b80'],
    plats: ['a', 6,'f', 6,'a', 5, 'b', 5,'a', 5,'b',5,'x',8, 'c',9,'a',9],
    width: 8400,
    factor: 149,
    pendiente: -0.5,
    title: 'Air Palace',
    nextl:'boss3',
    backG:function(){
      ctx.ft('      Enter                  ', xAxis+7650, yAxis-1000);
      ctx.ft('                          Masters!', xAxis+8650, yAxis-1100);
      ctx.fillStyle=white;
      ctx.ft('Elements are balanced', xAxis+400, yAxis-350);
      ctx.ft('    makes double damage to      ', xAxis+700, yAxis-250);
      ctx.ft('      makes double damage to      ', xAxis+1250, yAxis-350);
      ctx.ft('      makes double damage to     ', xAxis+1950, yAxis-200);
      ctx.ft('     makes double damage to    ', xAxis+3650, yAxis-300);
      ctx.ft('Press       to pause the game', xAxis+7650, yAxis-1000);
      ctx.ft('I\'m ready to destroy the         ', xAxis+8650, yAxis-1100);

      ctx.fillStyle= basicColors[0];
      ctx.ft('Air                             ', xAxis+700, yAxis-250);
      ctx.ft('                            Air', xAxis+3650, yAxis-300);
      ctx.fillStyle= basicColors[1];
      ctx.ft('                           Water', xAxis+700, yAxis-250);
      ctx.ft('Water                             ', xAxis+1250, yAxis-350);


      ctx.fillStyle= basicColors[2];
      ctx.ft('                             Earth', xAxis+1250, yAxis-350);
      ctx.ft('Earth                            ', xAxis+1950, yAxis-200);

      ctx.fillStyle= basicColors[3];

      ctx.ft('                             Fire', xAxis+1950, yAxis-200);
      ctx.ft('Fire                           ', xAxis+3650, yAxis-300);

    }
  },
  boss3: {
    codeMonsters:['x3m4'],
    plats:['c',2,'x',24,'c',2],
    width: 1024,
    factor: 50,
    pendiente: -0.1,
    title: 'Air Master',
    nextl:'level4',
    backG:blackBack
  },
  level4:{
    codeMonsters:['d3m4','d2m12','d2m20','d0m22', 'b2a28','b2a31','b2a32', 'b0m44', 'b3m50','a1c58','a3c60','a1c62','a3c64','c2b70', 'c2a75', 'd3d91', 'd1d95', 'd3d99'],
    plats:['a',4,'g',30, 'a',15, 'b',25,'a',15, 'b', 20,'w',18,'a',20,'e',20,'x',10, 'd',20, 'a',50,'v',18,'e',10,'a',20,'e',30,'a',49],
    width: 10024,
    factor: 27,
    pendiente: -0.55,
    title: 'Earth Palace',
    nextl:'boss4',
    backG:greenBack
  },
  boss4: {
    codeMonsters:['x4o4'],
    plats:['h',100],
    width: 1350,
    factor: 50,
    pendiente: -0.01,
    title: 'Earth Master',
    nextl:'level5',
    backG:greenBack
  },
  level5:{
    codeMonsters:['b1b4','e1e19','e3e24', 'f1b30','f3b32', 'd3m40', 'd1m44', 'd0m48', 'd2m56', 'e0a67', 'e3a70', 'e1a73'],
    plats:['a',4,'f',5,'v',9,'a',3,'b',3,'h',3,'e',3,'a',4,'v',6,'a',6],
    width: 7650,
    factor: 170,
    pendiente: -0.5,
    title: 'Water & Fire Montains',
    nextl:'boss5',
    backG:blueBack
  },
  boss5: {
    codeMonsters:['x5p5', 'x6q7'],
    plats:['b',14,'a',12,'e',14],
    width: 1330,
    factor: 35,
    pendiente: -0.1,
    title: 'Water & Fire Masters',
    nextl:'level6',
    backG:blueBack
  },
  level6:{
    codeMonsters:['b2a10', 'b2a12','b2a14','a0f25','a2f26','a2f27','a0f28','b1b38','b3e40','c0b68','c2b70','d1a106','d3m108','f0f110','f2f11','d3m113','d1a115'],
    plats:['a',60,'b',60,'a',60,'c',30,'a',60,'d',20,'a',60,'f',60,'a',60,'b',20,'i',30,'a',20,'v',60,'a',60,'v',33,'a',99],
    width: 12000,
    factor: 16,
    pendiente: -0.8,
    title: 'Grand Master Palace',
    nextl:'boss6a',
    backG:stormBack
  },
  boss6a:{
    codeMonsters:['x7z4'],
    width: 1200,
    plats:['a',2],
    factor: 700,
    pendiente: 1,
    title: 'Grand Master',
    nextl:'boss6b',
    backG:stormBack
  },
  boss6b:{
    codeMonsters:['z1r6','z2r6','z3r6','z4r6'],
    width: 1800,
    plats:['a',3],
    factor: 700,
    pendiente: 1,
    title: 'Element\'s Avatar challenge',
    nextl:'ends',
    backG:stormBack
  },
  ends:{
    codeMonsters:[],
    width: 1800,
    plats:['a',3],
    factor: 700,
    pendiente: 1,
    title: 'Grand master mode',
    nextl:'ends',
    backG:function(){
      ctx.ft('Congratulations! you beat the Game!', xAxis+400, yAxis-350);
      ctx.ft('==Thanks for playing==', xAxis+600, yAxis-150);
      ctx.ft('made by @agar3s', xAxis+1400, yAxis-150);
      ctx.ft('      F5                        ', xAxis+1600, yAxis+150);
      ctx.fillStyle = white;
      ctx.ft('press    to start the game again', xAxis+1600, yAxis+150);
    }
  }
}


function restartLevel(wy){
  var level = levels[currentLevel];
  enemies = [];
  powers = [];
  enemypowers = [];
  boosters = [];
  //ctx.translate(-viewport.x, viewport.y);
  ctx.translate(-viewport.x, -wy+viewport.y);
  viewport.x=0;
  viewport.y=wy;
  heroS.reset();
  myhero.reset();
  currentEnemy= undefined;
  xlevel = LevelGenerator(level);

  xAxis=0;
  yAxis=0;
}

function nextLevel(){
  currentLevel = levels[currentLevel].nextl;
  //ctx.translate(-viewport.x, viewport.y+720);
  //viewport
  restartLevel(viewport.y);
}
//var xlevel = LevelGenerator(levels[currentLevel]);

//restartLevel();
var heroS = new Sprite(hero, heroAnimations);
heroS.setAnimation('i');


var HeroT = function(sprite){
  var m = this;
  m.sprite = sprite;
  m.sprite.setPixelSize(5);  
  m.incColor = 0;
  m.down = 0;
  m.up = 0;

  m.reset = function(){
    m.del = 0;
    m.sprite.hp = 31;
    m.maxhp = 31;
    m.skills = new ElementalSkill([0,1,2,3],99);
    m.coldown = 16;
    m.currentColor = elementColors[m.skills.current];
    m.sprite.color = 'hsl('+m.currentColor+',100%, 50%)';
  }
  m.reset();
  m.lock = function(locks){
    for (var i = 0; i < locks.length; i++) {
      m.skills.lock(locks[i]);
    }
  }
  m.nextSkill = function(skill, index){
    if(skill+index>3) skill=index-1;
    else if(skill+index<0) skill=3+index+1;
    else skill+=index;
    if(m.skills.locks[skill]){
      return m.nextSkill(skill, index);
    }
    return skill;
  }
  m.selectSkill = function(index){
    m.skills.current= index;
    m.skills.updateCurrentQ();
    firexx.color = basicColors[m.skills.current];
  }
  m.next = function(){
    m.selectSkill(m.nextSkill(m.skills.current,1));
    m.incColor=5;
    keyMap-=64;
  }
  m.prev = function(){
    m.selectSkill(m.nextSkill(m.skills.current,-1));
    keyMap-=16;
    m.incColor=-5;
  }
  m.power = function(){
    if(m.coldown<=0){
      m.sprite.setAnimation('p');
      var vy = 0;
      if(m.down)vy=7;
      if(m.up)vy=-7;
      m.skills.power(vy, heroS.x+8*3, heroS.y);
      m.coldown = 16;
    }
    m.sprite.color = 'hsl('+m.currentColor+','+m.skills.currentQ+'%, 50%)';
  }
  m.update = function(){
    m.sprite.update();
    m.currentColor+=m.incColor;
    if(m.currentColor<0) m.currentColor=355;
    if(m.currentColor>355) m.currentColor=5;
    if(m.currentColor!=elementColors[m.skills.current]){
      m.sprite.color = 'hsl('+m.currentColor+','+m.skills.currentQ+'%, 50%)';
    }else{
      m.incColor = 0;
    }
    if(--m.coldown<0) m.coldown=0;
    if(m.sprite.y>400) m.del = 1;
  }
  m.manage= function(){
    if(keyMap&64) m.next();
    if(keyMap&16) m.prev();

    m.down=keyMap&8?1:0
    m.up=keyMap&2?1:0
    if(keyMap&128){
      if(m.sprite.jump()){
        getAudio([0,,0.2,,0.1081,0.3919,,0.1669,,,,,,0.361,,,,,1,,,,,0.45])
        
      }
      keyMap^=128;
    }
    if(keyMap&32) m.power();
    if(keyMap&1&&m.sprite.x>-16) m.sprite.left();
    else if(keyMap&4&&m.sprite.x+16*pixelSize<xlevel.w) m.sprite.right();
    else m.sprite.stopX();
  }

  m.hit = function(type, damage, direction){
    //console.log(type, m.skills.current, damage);
    //damage =getTotalDamage(type, m.skills.current, damage) ;
    //console.log('total damage:', damage);
    var totalDamage = getTotalDamage(type, m.skills.current, damage);
/*    var xv=(direction?1:-1)*totalDamage*10;
    m.sprite.x+=xv;
    if(m.sprite.x<0){
      m.sprite.x = 0;
    }else if(m.sprite.x>xlevel.w-64){
      m.sprite.x = xlevel.w-64;
    }else{
      viewport.x-=xv;
      ctx.translate(-xv,0);
    }
*/
    if(totalDamage==0){
      getAudio([2,0.09,0.04,0.19,0.12,0.13,0.08,-0.6065,-0.82,0.07,0.85,,,,,0.99,-1,-0.86,1,0.74,0.09,0.18,-1,0.5])
    }else{
      getAudio([3,,0.0949,,0.2521,0.4777,,-0.6065,,,,,,,,,,,1,,,0.216,,(totalDamage/(2*damage))-0.25])
    }
    if(heroS.hit(totalDamage)&&!m.del){
     // console.log('kill me');
      m.del = 1;
      //make me particles
      createParticles(heroS, damage, 0, 0, m.color);
      getAudio([3,,0.33,0.87,0.64,0.2,0.05,-0.0799,0.02,0.78,0.39,0.06,,,,,,,1,,,,,0.5])
      //create a new element cell to drop out
    }
    //currentEnemy = m;
    //console.log(1-m.sprite.hp/m.maxhp, m.sprite.hp);
  }
  m.charge = function(type, quantity){
    if(type==4){
      m.sprite.hp+=quantity;
      getAudio([0,,0.2353,,0.1763,0.4972,,0.4993,,,,,,0.2177,,0.4622,,,1,,,,,0.55])
      if(m.sprite.hp>m.maxhp)m.sprite.hp=m.maxhp;
    }else{
      getAudio([0,0.0199,0.1299,0.09,0.4,0.6,,0.3719,,,,,,0.4801*type/2,,0.7578,,,1,,,,,0.55])
      m.skills.charges[type]+=quantity;
      if(m.skills.charges[type]>99)m.skills.charges[type]=99;      
    }
  }
  //draw power indicators
  m.draw = function(vx, vy){
    with(ctx){
      fillStyle=white;
      fillText('Agtaske', vx+73, vy+20);
      strokeStyle = 'yellow';
      fillStyle = '#300';
      strokeRect (vx+35, vy+35,300,8);
      fillRect (vx+35, vy+35,300,8);
      fillStyle = 'yellow';
      fillRect (vx+35, vy+35, 300*(m.sprite.hp/m.maxhp),8);
      fillText('- '+xlevel.title+' -', vx+dimensions.w/2, vy+35);
    }
    m.skills.draw(vx, vy+dimensions.h);

    if(currentEnemy){
      with(currentEnemy){
        drawAvatar(vx+dimensions.w, vy);
        if(del&&--ghostTime==0) currentEnemy = null;
      }
    }
    m.sprite.drawFace(vx-35, vy+50);
  }
}
var hue = 0;
function introScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(vx, vy, 1024, 720);
  randomParticles();
  ctx.fillStyle=basicColors[1];
  ctx.strokeStyle='hsl('+(++hue)%720+',50%,50%)';
  ctx.font='normal lighter 242px fantasy';
  ctx.strokeText ("VIER", vx+512, vy+720*0.3);
  ctx.font='normal lighter 30px fantasy';
  ctx.lineWidth = 1;
  ctx.strokeText ("W i z a r d    W a r s", vx+512, vy+720*0.5);
  ctx.font='normal lighter 20px monospace';
  ctx.fillText ("Press         to Start", vx+512, vy+720*0.6);
  ctx.fillText ("made by @agar3s", vx+512, vy+720*0.9);
  ctx.fillStyle=loop%16==0?basicColors[1]:basicColors[0];
  ctx.fillText ("      <Enter>         ", vx+512, vy+720*0.6);
  for (var i = particles.length - 1; i >= 0; i--) {
    with(particles[i]){
      draw();
      if(update()){
        particles.splice(i, 1);
      }
    }
  }

}
ctx.ft = ctx.fillText;
function pauseScreen(vx, vy){
  //draw pause screen
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(vx, vy, dimensions.w, 720);
  ctx.fillStyle=white;
  setFont(0);
  ctx.ft ("PAUSE", vx+512, vy+720*0.2);
  ctx.ft ("Controls", vx+512, vy+720*0.3);
  
  ctx.ft ("<S>: Shoot", vx+dimensions.w*0.5, vy+720*0.4);

  ctx.ft ("<- : move to left ", vx+dimensions.w*0.2, vy+720*0.48);
  ctx.ft ("-> : move to right", vx+dimensions.w*0.2, vy+720*0.53);

  ctx.ft ("<space>   : jump       ", vx+dimensions.w*0.5, vy+720*0.48);
  ctx.ft ("<space>2X : double jump", vx+dimensions.w*0.5, vy+720*0.53);
  
  ctx.ft ("<D> : next element    ", vx+dimensions.w*0.8, vy+720*0.48);
  ctx.ft ("<A> : previous element", vx+dimensions.w*0.8, vy+720*0.53);

  
  ctx.ft ("Powers", vx+512, vy+720*0.63);
  
  ctx.ft ("      beats      ", vx+512, vy+720*0.7);
  ctx.ft ("      beats     ", vx+dimensions.w*0.7, vy+720*0.8);
  ctx.ft ("     beats    ", vx+512, vy+720*0.9);
  ctx.ft ("    beats      ", vx+dimensions.w*0.3, vy+720*0.8);
  
  ctx.fillStyle=basicColors[1];
  ctx.ft ("Water            ", vx+512, vy+720*0.7);
  ctx.ft ("          Water", vx+dimensions.w*0.3, vy+720*0.8);
  
  ctx.fillStyle=basicColors[2];
  ctx.ft ("Earth           ", vx+dimensions.w*0.7, vy+720*0.8);
  ctx.ft ("            Earth", vx+512, vy+720*0.7);
  
  
  ctx.fillStyle=basicColors[3];
  ctx.ft ("Fire          ", vx+512, vy+720*0.9);
  ctx.ft ("            Fire", vx+dimensions.w*0.7, vy+720*0.8);
  
  ctx.fillStyle=basicColors[0];
  ctx.fillText ("Air            ", vx+dimensions.w*0.3, vy+720*0.8);
  ctx.fillText ("           Air", vx+512, vy+720*0.9);

}

function deadScreen(vx, vy){
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.fillRect(vx, vy, dimensions.w, 720);
  ctx.fillStyle=white;
  setFont(0);
  ctx.fillText ("DEAD", vx+512, vy+720*0.3);
  setFont(1);
  ctx.fillText ("enter to restart level", vx+512, vy+720*0.5);
}
//@agar3s
var myhero = new HeroT(heroS);

var firexx = new Sprite(fire);
firexx.color = basicColors[0];
firexx.pixelSize = 3;

//enemies.push(new Enemy(2, ~~(Math.random()*4), Math.random()*xlevel.w, Math.random()*14,'jdg30w100ar30', 6,13, 40,3));
//enemies.push(generateMonster(monsterBook.a0, 3,monsterMoves.a));

var loop = 0;

// var boundsv
var xcam = 0; 
var ycam = 0;
var yOld = myhero.sprite.y;


//scale
//ctx.transform(1, 0, 0, 1, 0, 0);
var currentScreen = 'i';

var updateBackground = function(xxs){
  xAxis+=xxs*0.1;
}


function gameLoop() {
  var wx = -viewport.x;
  var wy = viewport.y;
  ctx.clearRect(wx, wy, dimensions.w, dimensions.h);
  //draw the guys
  xlevel.draw(wx, wy);
  
  heroS.accelerateY(0.8);
  xlevel.collides(heroS);
  if(!myhero.del)
    myhero.update();
  
  xlevel.onPlayerX(heroS.x);

  for (var j = powers.length - 1; j >= 0; j--) {
    with(powers[j]){
      update();
      sprite.draw();
      if(loop%4==0){
        animate();
      }
      if(loop%2==0)collides();
      if(outside||del){
        powers.splice(j, 1);
      }
    }
  }

  for (var j = enemies.length - 1; j >= 0; j--) {
    with(enemies[j]){
      if(del){
        enemies.splice(j, 1);
        xlevel.onEnemyDied();
        continue;
      }
      sprite.draw();
      sprite.accelerateY(0.8);
      xlevel.collides(sprite);
      update();
      if(loop%2==0)
        sprite.animate();
    }
  }

  for (var j = enemypowers.length - 1; j >= 0; j--) {
    with(enemypowers[j]){
      update();
      sprite.draw();
      if(loop%4==0){
        animate();
      }
      if(loop%2==0)collidesHero(heroS.bounds());
      if(outside||del){
        enemypowers.splice(j, 1);
      }
    }
  }

  for (var i = particles.length - 1; i >= 0; i--) {
    with(particles[i]){
      draw();
      if(update()){
        particles.splice(i, 1);
      }
    }
  }
  for (var i = boosters.length - 1; i >= 0; i--) {
    with(boosters[i]){
      update()
      xlevel.collides(sprite);
      sprite.draw();
      if(loop%2==0)collidesHero(heroS.bounds());
      if(del){
        boosters.splice(i, 1);
      }
    }
  }

  if(loop%8==0){
    firexx.rotate();
  }
  firexx.updateX();
  
  if(loop%2==0){
    heroS.animate();
  }
  
  if(!myhero.del){
    heroS.draw();
    myhero.manage();
    myhero.draw(wx, wy);
  }else{
    currentScreen='d';
  }

  //update the viewport
  if(myhero.sprite.x>450-wx&&myhero.sprite.x<xlevel.w-dimensions.w+450){
    viewport.x-=myhero.sprite.vx;
    xxx=-myhero.sprite.vx;
  }else{
    xxx=0;
  }
  yyy = 0;
  if((wy-viewport.oY<-dimensions.h&&myhero.sprite.y+viewport.oY+16*pixelSize>wy+dimensions.h&&myhero.sprite.vy>0))
    yyy= -myhero.sprite.vy;
  else if(myhero.sprite.y-viewport.oY<viewport.y)
    if(myhero.sprite.vy<0)
      yyy= -myhero.sprite.vy;
    else if(myhero.sprite.vy==0)
      yyy = yOld-myhero.sprite.y;
  
  viewport.y-=yyy;
  yOld = myhero.sprite.y;
  ctx.translate(xxx, yyy);
  updateBackground(xxx);

  //draw user interface information
}

//different screens
//game state = current screen
var showScreen = {
  g: gameLoop,
  i: introScreen,
  p: pauseScreen,
  d: function(wx, wy){
    gameLoop();
    deadScreen(wx, wy);
  }
}
//actions that the user can do at screen
var actionsScreen = {
  g: function(key){
    currentScreen = 'p';
  },
  i: function(key){
    restartLevel(-720);
    currentScreen = 'g';
  },
  p: function(key){
    currentScreen = 'g';
  },
  d: function(key){
    console.log('restart level');
    restartLevel(-720);
    currentScreen = 'g';
  }
}
function mainLoop(){
  showScreen[currentScreen](-viewport.x, viewport.y);
  if(keyMap&256){
    actionsScreen[currentScreen](1);
    keyMap-=256;
  }
  if(loop%64==0){
    loop=0;
  }
  loop++;
  with(gl){
    texImage2D(TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, canvitas);
    drawArrays(TRIANGLES, 0, 6);
  }
  ra(mainLoop);
}

ra(mainLoop);
}());