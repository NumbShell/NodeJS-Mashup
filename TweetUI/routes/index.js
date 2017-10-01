var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {
    request('http://127.0.0.1:8484/pi/api/famous/all', function(err, response, body) {
        if(err) throw err;

        var result = JSON.parse(body);
        var person = result.rows.map(function(person) {
            return person.doc;
        });
        res.render('index', {persons: person});
    });
});

/* GET documentation page. */
router.get('/docs', function(req, res, next) {
    res.render('docs');
});

/*
    Add(Twitter data to db) and return new user.
 */
router.post('/user',urlencodedParser, function(req, res, next) {
    var url = 'http://localhost:8484/pi/api/twitter/user/' + req.body.nickname;
    console.log('/user req.body.id ' + req.body.nickname);
    request(url, function(err, response, body) {
        if(err) throw err;
        res.render('docs', {console: body});
    });
})

/*
    Return all users in the API db.
 */
router.get('/famous/all',urlencodedParser, function(req, res, next) {
    var url = 'http://localhost:8484/pi/api/famous/all';
    request(url, function(err, response, body) {
        if(err) throw err;
        res.render('docs', {console: body});
    });
})

/*
    Does not work.
 */
router.get('/delete',urlencodedParser, function(req, res, next) {
    console.log('/delete');
    var url = 'http://localhost:8484/pi/api/delete/' + req.body.id + '/rev/' + req.body.rev;

    request.delete(url, function(err, response, body) {
        if(err) throw err;
        res.render('docs', {console: "[Done]"});
    });
    /*
    request({
        method: 'DELETE',
        url: url,
        header: [
            {"Content-Type": "application/json"}
        ],
        data: [
            {body: {id: req.body.id, rev: req.body.rev, "content-type": "application/json"}}
        ]
    }, function(err, response, body) {
        if(err) throw err;
        res.render('docs', {console: body});
    });
    */
})


module.exports = router;
