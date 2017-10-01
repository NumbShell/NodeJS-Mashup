/**
 * Created by Simon Gruber on 2017-09-16.
 */

/*
    Handle the requests and responses of the UI
 */
var utils = require('../resources/utils');
var resources = require('../resources/resources.json');
var CouchDb = require('node-couchdb');
var PouchDb = require('pouchdb');
var express = require('express'),
    router = express.Router();

//Pouchdb
var db = new PouchDb('http://127.0.0.1:6000/twitter');

// node-couchdb instance talking to external service
var couchExternal = new CouchDb({
    host: 'localhost',
    port: 6000,
    auth: {
        user: 'admin',
        password: 'password'
    }
});

var dbName = "twitter";
var viewUrl = "_design/all/_view/all-view";

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

/*
 Return data on famous people and their most recent tweet.
 */
router.route('/famous/all').get(function(req, res, next) {
    db.allDocs({
        include_docs: true,
        attachments: true
    }, function(err, response) {
        if (err) { return console.log(err); }
        res.send(response);
    });

    /*
    database.get({include_docs: true}).then(
        function(data, headers, status){
            res.json(data.data.rows);
        }, function(err){
            if(err) throw err;
        });
    */
});

/*
    Does not work yet.
 */
router.route('/delete/:id/rev/:rev').delete(function(req, res, next) {
    console.log('delete route');
    var id = req.params.id;
    var rev = req.params.rev;

    //If id and rev have values, proceed.
    utils.getParams([id, rev]).then(function() {
        couchExternal.del(dbName, id, rev).then(
            function(data, headers, status) {
                res.json(data);
            },function(err) {
                console.log(err);
            });
    }, function(err) {
        console.log(err);
    });
});


module.exports = router;