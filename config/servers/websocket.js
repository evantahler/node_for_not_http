// Note that to use the websocket server, you also need the web server enabled

exports.default = { 
  servers: {
    websocket: function(api){
      return {
        enabled:          true,
        // you can pass a FQDN here, or function to be called / window object to be inspected
        clientUrl:        'window.location.origin',        
        // Directory to render client-side JS.  
        // Path should start with "/" and will be built starting from api.config..general.paths.public
        clientJsPath:     'javascript/',
        // the name of the client-side JS file to render.  Both `.js` and `.min.js` versions will be created
        // do not include the file exension
        // set to `null` to not render the client-side JS on boot
        clientJsName:     'actionheroClient',

        // Primus Server Options: 
        server: {
          // authorization: null,
          // pathname:      '/primus',
          // parser:        'JSON',
          // transformer:   'websockets',
          // plugin:        {},
          // timeout:       35000,
          // origins:       '*',
          // methods:       ['GET','HEAD','PUT','POST','DELETE','OPTIONS'],
          // credentials:   true,
          // maxAge:        '30 days',
          // headers:       false,
          // exposed:       false,
        },

        // Priumus Client Options: 
        client: {
          apiPath:             '/api', // the api base endpoint on your actionhero server
          // reconnect:        {},
          // timeout:          10000,
          // ping:             25000,
          // pong:             10000,
          // strategy:         "online",
          // manual:           false,
          // websockets:       true,
          // network:          true,
          // transport:        {},
          // queueSize:        Infinity,
        },
      }
    }
  }
}