#!/usr/bin/env node
 
// A simple DMX example which will turn all the lights on and off every second

///////////////////
// dmx.js //
///////////////////
 
var ftdi = require('ftdi');

var settings = {
  'baudrate': 115200 / 2,
  'databits': 8,
  'stopbits': 2,
  'parity'  : 'none',
};
 
var sleepTime = 21;
var device;
var universe = new Buffer(513);
var on = true;
universe[0]   = 0x00;
setAll(250);

function writeLoop(){
  device.write(universe);
  process.stdout.write(".");
  setTimeout(function(){
    writeLoop();
  }, sleepTime);
}


function setAll(v){
  var i = 1;
  while(i < universe.length){
    universe[i] = parseInt(v);
    i++;
  }
}

var flop = function(){
  if(on === true){
    setAll(0);
  }else{
    setAll(250);
  }
  on = !on;
};
 
ftdi.find(function(err, devices){
  console.log(devices);
  device = new ftdi.FtdiDevice(devices[0]);
  setInterval(flop, 1000);
  device.open(settings, function(){
    writeLoop();
  });
});