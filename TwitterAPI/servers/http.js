
var CouchDb = require('node-couchdb');
var express = require('express'),
    twitterRoutes = require('./../routes/twitter'),
    apiRoutes = require('./../routes/api');
    resources = require('./../resources/model'),
    cors = require('cors');

var app = express();

app.use(cors());
app.use('/pi/api/twitter', twitterRoutes);
app.use('/pi/api', apiRoutes);

app.get('/pi', function(req, res) {
    res.send('This is the WoT-Pi');
});

module.exports = app;