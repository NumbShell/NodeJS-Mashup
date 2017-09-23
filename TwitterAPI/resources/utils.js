/**
 * Created by Simon Gruber on 2017-09-23.
 */

/*
    Handles promises and other utils.
 */

var utils = {};

/*
    getParams - check if the past in parameters are undefined, if they
    are then reject, else keep going.
 */
utils.getParams = function(params) {
    return new Promise(function(resolve, reject) {
        for(var i = 0; i < params.length; i++) {
            if(params[i] === undefined) {
                reject((params[i]));
            }
        }
        resolve("Works!");
    });
}

module.exports = utils;