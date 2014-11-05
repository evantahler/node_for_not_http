exports.action = {
  name:                   'dmx',
  description:            'dmx',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: ['channel', 'power'],
    optional: [],
  },

  run: function(api, connection, next){
    var channel = parseInt(connection.params.channel);
    var power   = parseInt(connection.params.power);
    try{
      api.dmx.set(channel, power);
    }catch(err){
      connection.error = err;
    }
    next(connection, true);
  }
};