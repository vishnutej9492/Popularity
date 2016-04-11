var request = require('request');
var https = require('https');
var google = require ('googleapis');
google.options ({ auth: '#KEY' });
var youtube = google.youtube ('v3');
var ytCount=0;
var twitchCount=0;
var twitterCount=0;
var popIndex=0;

if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " TwitchHandle TwitterHandle ");
    process.exit(-1);
}
 
var twitchHandle = process.argv[2];
var twitterHandle = process.argv[3];
 
console.log('Parameters: ' + twitchHandle +' '+ twitterHandle);

function search_youtube (query, callback) {
  youtube.search.list (
    {
      part: 'snippet',
      type: 'video',
      q: query,
      maxResults: 5,
      order: 'viewCount'
    },
    function (err, res) {
      if (err) { return callback (err); }
      res.items.forEach (function (result) {
        var video = {
          id: result.id.videoId,
          urlLong: 'http://www.youtube.com/watch?v='+ result.id.videoId,
          published: result.snippet.publishedAt,
          title: result.snippet.title || '',
          channelTitle: result.snippet.channelTitle,
        };
        youtube.videos.list (
          {
            part: 'statistics',
            id: video.id
          },
          function (err2, data) {
            if (err2) { return callback (err2); }
            if (data.items.length >= 1) {
              video.viewCount = data.items[0].statistics.viewCount;	
              ytCount = ytCount + parseInt(data.items[0].statistics.viewCount, 10);
              //callback (video);
            }
          }
        );
      });
    }
  );
}
search_youtube (twitchHandle, console.log);
setTimeout(function(){
    console.log('Youtube Top5 Views:'+ytCount);
},1000);

var http= require("http");
var url = "http://api.twitch.tv/kraken/channels/"+twitchHandle;
var request = http.get(url, function (response) {
    var buffer = "", 
        data;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        data = JSON.parse(buffer);
        twitchCount=data.views;
        console.log('Twitch Channel Views:'+data.views);
    }); 
}); 

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '#KEY',
  consumer_secret: '#KEY',
  access_token_key: '#KEY',
  access_token_secret: '#KEY'
});
 
var params = {screen_name: twitterHandle};
client.get('users/show', params, function(error, tweets, response){
  if (!error) {
  	twitterCount=tweets.followers_count;
    console.log('Twitter Followers:'+tweets.followers_count);
  }
});

setTimeout(function(){
	var popularityIndex= ((ytCount/5)+twitchCount+twitterCount)/500000;
    console.log('Popularity Index (out of 100): '+popularityIndex);
},1400);