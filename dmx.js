#!/usr/bin/env node
 
///////////////////
// dmx.js //
///////////////////
 
var ftdi = require('ftdi');

var settings = {
  'baudrate': 115200 / 2, // needs to be devided by 2... for some reason
  'databits': 8,
  'stopbits': 2,
  // 'parity'  : 'odd',
  // 'parity'  : 'even',
  // 'parity'  : 'mark',
  // 'parity'  : 'space',
  'parity'  : 'none',
};
 
var sleepTime = 21;
var device;
// var universe = new Buffer(513);
var universe = new Buffer(10);
var on = true;
universe[0]   = 0x00;
setAll(0x00);

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
    setAll(0x00);
  }else{
    setAll(250);
  }
  on = !on;

  console.log(universe);
};
 
ftdi.find(function(err, devices){
  console.log(devices);
  device = new ftdi.FtdiDevice(devices[0]);
  setAll(250); // why <--- ?
  setInterval(flop, 500);
  device.open(settings, function(){
    writeLoop();
    console.log(universe);
  });
});