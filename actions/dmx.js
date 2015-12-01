exports.action = {
  name:                   'dmx',
  description:            'dmx',
  outputExample:          {},
  version:                1.0,
  toDocument:             true,

  inputs: {
    channel: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
    power: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    try{
      api.dmx.set(data.params.channel, data.params.power);
      // api.dmx.setAll(data.params.power);
      data.response.ok = true;
    }catch(err){
      next(err);
    }
    next();
  }
};