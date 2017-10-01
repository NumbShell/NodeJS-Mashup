/*
    Handle the requests to the Twitter API
 */
var utils = require('../resources/utils');
var resources = require('../resources/model');
var CouchDb = require('node-couchdb');
var PouchDb = require('pouchdb');
var Twitter = require('twitter');
var express = require('express'),
    router = express.Router();

//Pouchdb
var db = new PouchDb('http://localhost:5984/twitter');

var dbName = "twitter";
var viewUrl = "_design/all/_view/all-view";
var database = new CouchDb({
   auth: {
       user: 'admin',
       password: 'password'
   }
});

var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var urls = {
    'users': 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=1&screen_name=',
    'tweets': 'https://api.twitter.com/1.1/search/tweets.json?q=%40'
}

/*
    Request user from Twitter's api if it does not already exist in the db.
 */
router.route('/user/:user').get(function(req, res, next) {

    addUser();
    function addUser() {
        utils.getParams([req.params.user]).then(function() {
            client.get(urls.users + req.params.user, function (error, data, response) {
                if(error) throw error;
                var user = data[0].user;
                var id = String(Math.floor(Math.random()*50000));

                db.put({
                    _id: id,
                    "name": user.name,
                    "screen_name": user.screen_name,
                    "tweet": data[0].text,
                    "description": user.description,
                    "followers": user.followers_count,
                    "friends": user.friends_count,
                    "lang": user.lang,
                    "location": user.location,
                    "profile_image_url": user.profile_image_url,
                    "joined": user.created_at
                }, function(err) {
                    if(err) {return console.log(err);}
                    console.log("Added to Database.");
                    res.send("Added to Database.");
                })
            });
        }, function(err) {
            console.log(err);
            res.send("No Username Found.");
        });
    }
});

module.exports = router;