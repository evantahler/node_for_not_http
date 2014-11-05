exports.default = {
  dmx: function(api){
    return {
      'baudrate': 115200 / 2, // needs to be devided by 2... for some reason
      'databits': 8,
      'stopbits': 2,
      'parity'  : 'none',
    };
  }
};