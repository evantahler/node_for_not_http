#!/usr/bin/env node
 
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
 
var sleepTime = 20;
var device;

var universe = new Buffer([
  0,  
  250, 
  250, 
  250, 
  250,
], 'hex');

function writeLoop(){
  device.write(universe);
  setTimeout(function(){
    writeLoop();
  }, sleepTime);
}
 
ftdi.find(function(err, devices){
  console.log(devices);
  device = new ftdi.FtdiDevice(devices[0]);

  device.on('data', function(d){ console.log(d); });
  device.on('error', function(e){ console.log(e); });
  device.on('open', function(){ console.log('opened'); });
  
  device.open(settings, function(){
    writeLoop();
  });
});