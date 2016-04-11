var google = require ('googleapis');
google.options ({ auth: 'AIzaSyBIG38r2mMIRw_UXbUVyXnHSua8-2LWCzY' });
var youtube = google.youtube ('v3');
var sumCount=0;

// Search Youtube -- callback is called on each found item
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
              sumCount = sumCount + parseInt(data.items[0].statistics.viewCount, 10);
              callback (video);
            }
          }
        );
      });
    }
  );
}
search_youtube ('c9 skadoodle', console.log);
setTimeout(function(){
    console.log('Sum of top 5 video view counts:'+sumCount);
},1000);

