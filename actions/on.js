exports.action = {
  name:                   'on',
  description:            'on',
  outputExample:          {},
  version:                1.0,
  toDocument:             true,

  inputs: {},

  run: function(api, data, next){
    try{
      api.dmx.setAll(250);
      data.response.ok = true;
    }catch(err){
      next(err);
    }
    next();
  }
};