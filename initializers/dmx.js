// http://playground.arduino.cc/DMX/Protokoll
var ftdi = require('ftdi');
var cluster = require('cluster');

module.exports = {
  initialize: function(api, next){

    var worker;
    if(cluster.isMaster){
      cluster.setupMaster({exec: __dirname + '/../dmx.js'});
      worker = cluster.fork();
    }

    api.dmx = {

      worker: worker,

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
          api.dmx.worker.send(JSON.stringify({
            channel: k,
            power: v,
          }));
        }
      },

      setAll: function(v){
        api.dmx.worker.send(JSON.stringify({
          all: true,
          power: v,
        }));
      },

    };

    next();
  }
};
