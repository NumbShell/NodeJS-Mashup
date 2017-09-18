/*
    Handle the requests to the Twitter API
 */

var resources = require('../resources/model');
var CouchDb = require('node-couchdb');
var Twitter = require('twitter');
var express = require('express'),
    router = express.Router();

var dbName = "twitter";
var viewUrl = "_design/all/_view/all-view";
var database = new CouchDb({
   auth: {
       user: 'admin',
       password: 'password'
   }
});

var client = new Twitter({
    consumer_key: '22ouZ9LCMt4YP8SRD7T1rDO4R',
    consumer_secret: 'V9UgiZdZHEbpT9NAiK4K665GOG1jiTVy0yErwHfoEU9fP88ZZc',
    access_token_key: '908739473395060738-YeboYHlq4cdQBvbY2SjxJ3HBjLAKsvK',
    access_token_secret: 'nrm9CLYEJMHj8eF5PgtkTpxXBY05MgQlA5f0gcl7H0KY8'
});

var urls = {
    'users': 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=1&screen_name=',
    'tweets': 'https://api.twitter.com/1.1/search/tweets.json?q=%40'
}

/*
    Request user from Twitter's api if it does not already exist in the db.
 */
router.route('/user/:user').get(function(req, res, next) {
    database.get(dbName, viewUrl, {include_docs: true}).then(
        function(data, headers, status){
            console.log(data);
            var exists = false;
            var user = {};
            data.data.rows.map(function(doc) {
                console.log("req.params.user " + req.params.user);
                if(doc.doc.screen_name === req.params.user) {
                    exists = true;
                    user = doc;
                }
            })
            if(!exists) {
                addUser();
            }else {
                res.json(user);
            }

        }, function(err){
            if(err) throw err;
        });

    function addUser() {
        client.get(urls.users + req.params.user, function (error, data, response) {
            if(error) throw error;
            var user = data[0].user;
            var id = String(Math.floor(Math.random()*50000));

            database.insert(resources.database.name, {
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
            }).then(function (data, headers, status) {
                console.log("Success!");
                res.json("User added to db");
            }, function (err) {
                console.log(err);
            });
        });
    }
});

module.exports = router;