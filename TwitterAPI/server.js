/**
 * Created by Simon Gruber on 2017-09-14.
 */

var httpServer = require('./servers/http'),
    resources = require('./resources/model');

var server = httpServer.listen(resources.pi.port, function() {
    console.info('Your Pi is up and running on port %s', resources.pi.port);
})