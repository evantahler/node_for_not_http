exports.action = {
  name:                   'off',
  description:            'off',
  outputExample:          {},
  version:                1.0,
  toDocument:             true,

  inputs: {},

  run: function(api, data, next){
    try{
      api.dmx.setAll(0);
      data.response.ok = true;
    }catch(err){
      next(err);
    }
    next();
  }
};