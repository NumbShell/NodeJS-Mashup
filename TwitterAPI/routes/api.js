/**
 * Created by Simon Gruber on 2017-09-16.
 */

/*
    Handle the requests and responses of the UI
 */
var resources = require('../resources/resources.json');
var CouchDb = require('node-couchdb');
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

router.route('/').get(function(req, res, next) {
    /*
        Return basic information about the api.
     */
    res.send(resources.pi.api);
});

router.route('/user/:user').get(function(req, res, next) {
    /*
        Retrive data from database (if exist) else make a twitter
        request from the twitter.js routes (I think?)
     */
    res.send("Raspberry Pi API");
});

router.route('/famous/all').get(function(req, res, next) {
    /*
        Return data on famous people and their most recent tweet.
     */
    database.get(dbName, viewUrl, {include_docs: true}).then(
        function(data, headers, status){
            res.json(data.data.rows);
        }, function(err){
            if(err) throw err;
        });
});


router.route('/delete/:id').delete(function(req, res, next) {
    /*
     Retrive data from database (if exist) else make a twitter
     request from the twitter.js routes (I think?)
     */
    console.log("DELETE - req.params.id " + req.params.id);
    console.log("REQ " + req);

    var id = req.body.id;
    var rev = req.body.rev;

    database.del(dbName, id, rev).then(
        function(data, headers, status) {
        res.json(data);
    },function(err) {
        console.log(err);
    });
});


module.exports = router;