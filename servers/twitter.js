var Twitter = require("twitter");

var initialize = function(api, options, next){

  //////////
  // INIT //
  //////////

  var type = 'twitter';

  var attributes = {
    canChat: true,
    logConnections: true,
    logExits: false,
    sendWelcomeMessage: false,
    verbs: ['say']
  };

  var server = new api.genericServer(type, options, attributes);

  //////////////////////
  // REQUIRED METHODS //
  //////////////////////

  server.start = function(next){
    var self = this;
    
    api.twitter = new Twitter({
      consumer_key:        api.config.servers.twitter.consumer_key,
      consumer_secret:     api.config.servers.twitter.consumer_secret,
      access_token_key:    api.config.servers.twitter.access_token_key,
      access_token_secret: api.config.servers.twitter.access_token_secret
    });

    api.log('twitter tracking: #' + api.config.servers.twitter.hashtag);
    api.twitter.stream('statuses/filter', {track: api.config.servers.twitter.hashtag}, function(stream) {
      stream.on('data', function(tweet) {
        self.addTweet(tweet);
      });
     
      stream.on('error', function(error) {
        throw error;
      });
    });

    next();
  };

  server.stop = function(next){
    next();
  };

  server.addTweet = function(tweet){
    var twitterUser;
    try{
       twitterUser = tweet.user.screen_name;
    }catch(e){
      var twitterUser = "unknown";
    }
    server.buildConnection({
      id: tweet.id,
      rawConnection  : { 
        hashtag: api.config.servers.twitter.hashtag,
        clientId: tweet.id,
        message: tweet.text,
        twitterUser: twitterUser,
      }, 
      remoteAddress  : 0,
      remotePort     : 0 ,
    }); // will emit "connection"
  };

  server.sendMessage = function(connection, message, messageCount){

  };

  server.sendFile = function(connection, error, fileStream, mime, length){

  };

  server.goodbye = function(connection, reason){

  };

  ////////////
  // EVENTS //
  ////////////

  server.on('connection', function(connection){
    connection.error = null;
    connection.response = {};
    var action = '';

    if(connection.rawConnection.message.match(/ off/)){
      action = 'off';
    }
    else if(connection.rawConnection.message.match(/ on/)){
      action = 'on';
    }

    connection.params = {
      hashtag: connection.rawConnection.hashtag,
      message: connection.rawConnection.message,
      twitterUser: connection.rawConnection.twitterUser,
      action: action,
    };

    server.processAction(connection);
  });

  server.on('actionComplete', function(data){
    data.connection.destroy();
  });

  /////////////
  // HELPERS //
  /////////////

  next(server);
};

exports.initialize = initialize;
