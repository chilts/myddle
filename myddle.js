// ----------------------------------------------------------------------------
//
// myddle.js - Context carrying Middleware for regular functions, with error handlers.
//
// Copyright 2013 Andrew Chilton. All Rights Reserved.
//
// License: MIT - http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------

module.exports = function(context, fns, callback) {
    // if context isn't given
    if ( Array.isArray(context) ) {
        callback = fns;
        fns = context;
        context = {};
    }

    if ( typeof callback !== 'function' ) {
        callback = context;
        context = {};
    }

    // call each function (of length 1 or 2) in turn
    var upToIndex = -1;
    var err = null;

    function doNext() {
        // incremement to the next function
        upToIndex = upToIndex + 1;

        // we're finished since there are no more fns
        if ( upToIndex === fns.length ) {
            return callback(err, context);
        }

        // if this is an error function, just skip to the next one
        // since we're not in an error state
        if ( fns[upToIndex].length > 2 ) {
            return process.nextTick(function() {
                doNext();
            });
        }

        // call this function with the context
        fns[upToIndex](context, function(thisErr) {
            if (thisErr) {
                err = thisErr;
                return doNextError();
            }

            // no error, so continue back on the regular chain and clear the error
            err = null;
            doNext();
        });
    }

    function doNextError() {
        // incremement to the next function
        upToIndex = upToIndex + 1;

        // we're finished since there are no more fns
        if ( upToIndex === fns.length ) {
            return callback(err, context);
        }

        // if this is a normal function, just skip to the next one
        // since we're currently in an error state
        if ( fns[upToIndex].length < 3 ) {
            return process.nextTick(function() {
                doNextError();
            });
        }

        // call this function with the err and the context
        fns[upToIndex](err, context, function(thisErr) {
            if (thisErr) {
                err = thisErr;
                return doNextError();
            }
            // no error, so continue back on the regular chain and clear the error
            err = null;
            doNext();
        });
    }

    // kick things off
    doNext();
};

// ----------------------------------------------------------------------------
