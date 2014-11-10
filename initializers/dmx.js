// http://playground.arduino.cc/DMX/Protokoll

var ftdi = require('ftdi');

// function toHex(number){
//   var octet =  parseInt(number).toString(16);
//   if(octet.length == 1){ octet = "0" + octet; }
//   var fullOctet = "0x" + octet;
//   return eval(fullOctet);
//   // return fullOctet;
// }

exports.dmx = function(api, next){  
 
  api.dmx = {

    sleepTime: 200, // ms between DMX Frames; this is locked
    deviceId: 0,   // assume the first FTDI device is the one we want
    device: null,
    // universe: new Array(513),
    universe: new Buffer(10),
    timer: null,

    _start: function(api, next){
      api.dmx.universe[0] = 0x00;
      // api.dmx.setAll(250);
      api.dmx.setAll(250, false);

      ftdi.find(function(err, devices){
        api.log('DMX Devices on this host:', 'info', devices);
        if(devices.length > 0){
          api.dmx.device = new ftdi.FtdiDevice(devices[api.dmx.deviceId]);
          api.dmx.device.on('error', function(e){
            console.log(e);
          });
          api.dmx.device.open(api.config.dmx, function(){
            api.dmx.writeLoop();
            next();
          });
        }else{
          api.log("no DMX devices found, moving on...", 'warning');
          next();
        }
      });
    }, 

    _stop: function(api, next){
      clearTimeout(api.dmx.timer);
      if(api.dmx.device){
        api.dmx.device.close(function(){
          next();
        });
      }else{
        next();
      }
    },

    writeLoop: function(){
      clearTimeout(api.dmx.timer);
      api.dmx.device.write(api.dmx.universe);
      api.dmx.timer = setTimeout(function(){ api.dmx.writeLoop(); }, api.dmx.sleepTime);
    },

    set: function(k,v){
      if(k < 1 || k > 512){
        throw new Error('DMX Channel needs to be 512 > x > 0 ');
      }else if(v < 0 || v > 255){
        throw new Error('DMX Power needs to be 255 > x > 0 ');
      }else{
        api.log('[DMX] channel ' + k + ' @ ' + v);
        api.dmx.universe[k] = parseInt(v);

      }
    },

    setAll: function(v){
      var i = 1;
      while(i < (api.dmx.universe.length)){
        api.dmx.set(i,v);
        i++;
      }
    },

  };

  next();
}