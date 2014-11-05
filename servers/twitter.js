var ntwitter = require("ntwitter");

var twitter = function(api, options, next){

  //////////
  // INIT //
  //////////

  var type = "twitter";
  var attributes = {
    canChat: true,
    logConnections: false,
    logExits: false,
    sendWelcomeMessage: false,
    verbs: [
      'say'
    ],
  };

  var server = new api.genericServer(type, options, attributes);

  //////////////////////
  // REQUIRED METHODS //
  //////////////////////

  server._start = function(next){
    var self = this;
    
    api.twitter = new ntwitter({
      consumer_key:        api.config.servers.twitter.consumer_key,
      consumer_secret:     api.config.servers.twitter.consumer_secret,
      access_token_key:    api.config.servers.twitter.access_token_key,
      access_token_secret: api.config.servers.twitter.access_token_secret
    });

    api.twitter.verifyCredentials(function (err, data) {
      if(!err){
        api.twitter.stream('statuses/filter', {track:'#' + api.config.servers.twitter.hashtag}, function(stream) {
          api.twitterStram = stream;
          api.twitterStram.on('data', function (tweet) {
            self.addTweet(tweet);
          });
          next();
        });
      }else{
        api.log("Twitter Error: " + err, "error");
        next();
      }
    });
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

  server._stop = function(next){
    next();
  };

  server.goodbye = function(connection, reason){
    //
  };

  ////////////
  // EVENTS //
  ////////////

  server.on("connection", function(connection){
    connection.error = null;
    // TODO: 
    connection.params = {
      channel: 1,
      power: 0
    };
    connection.response = {};
    server.processAction(connection);
  });

  server.on('actionComplete', function(connection, toRender, messageCount){
    connection.destroy();
  });

  /////////////
  // HELPERS //
  /////////////

  next(server);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.twitter = twitter;