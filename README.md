# Popularity Index for Gamers/Streamers associated with Twitch

Libraries used:

googleapis
request
twitter

Installation: 

npm install googleapis
npm install request
npm install twitter

Obtaining API Keys:

Obtain the keys from the Youtube Data API and Twitter API.

Once you have the keys input them replacing #KEY as required.

Usage: 

node popularity.js TwitchHandle TwitterHandle

Ex: node popularity.js summit1g summit1g

Formula to calculate Popularity Index:

(Top 5 Youtube Video Count/ 5) + Twitch Views + Twitter Followers / 500000

