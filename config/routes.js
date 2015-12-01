exports.default = { 
  routes: function(api){
    return {
      
      all: [
        { path: '/dmx/:channel/:power', action: 'dmx' },
        { path: '/dmx/on',              action: 'on' },
        { path: '/dmx/off',             action: 'off' }, 
      ]
            
    };
  }
};
