#!/usr/bin/env node
 
// A simple DMX example which will turn all the lights on and off every second
// You can use this as a fork within another application as well (cluster-awareness)

////////////
// dmx.js //
////////////
 
var ftdi    = require('ftdi');
var cluster = require('cluster');

var settings = {
  // 'baudrate': 250000,
  // 'baudrate': 250000 / 4,
  'baudrate': 115200 / 2,
  'databits': 8,
  'stopbits': 2,
  'parity'  : 'none',
};
var sleepTime = 0.026 * 1000;

var device;
var universe = new Buffer(512, 'binary');
var on = false;
var loopTimer;

function writeLoop(){
  clearTimeout(loopTimer);
  
  // device.write([]);
  setTimeout(function(){
    device.write([0x00]);
    device.write(universe);

    if(cluster.isMaster){ process.stdout.write("."); }

    loopTimer = setTimeout(writeLoop, sleepTime);
  }, 88);
}

function set(k,v){
  universe[parseInt(k) - 1] = parseInt(v);
  console.log('[DMX] ' + k + ':' + v);
}

function setAll(v){
  var i = 0;
  while(i < universe.length){
    universe[i] = parseInt(v);
    i++;
  }
  console.log('[DMX] all:' + v);
}

var flop = function(){
  if(on === true){
    setAll(0);
  }else{
    setAll(250);
  }
  on = !on;
};

////////
// GO //
////////

setAll(0);
 
ftdi.find(function(err, devices){
  console.log(devices);
  device = new ftdi.FtdiDevice(devices[0]); 
  device.open(settings, function(){
    writeLoop();

    if(cluster.isMaster){
      setInterval(flop, 500);
    }else{
      process.on('message', function(message){
        message = JSON.parse(message);
        if(message.all === true){
          setAll(message.power);
        }else{
          set(message.channel, message.power);
        }
      });
    }
  });
});