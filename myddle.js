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
    console.log('1 - ' + typeof context);
    console.log('1 - ' + Array.isArray(context));
    console.log('2 - ' + typeof fns);
    console.log('3 - ' + typeof callback);

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
    console.log('1 - ' + typeof context);
    console.log('1 - ' + Array.isArray(context));
    console.log('2 - ' + typeof fns);
    console.log('3 - ' + typeof callback);

    fns.forEach(function(fn) {
        console.log(fn);
        console.log(fn.length);
    });

    // call each function (of length 1 or 2) in turn
    var upToIndex = -1;
    var err = null;

    function doNext() {
        console.log('doNext(): entry');

        // incremement to the next function
        upToIndex = upToIndex + 1;

        // we're finished since there are no more fns
        if ( upToIndex === fns.length ) {
            console.log('doNextError(): calling callback');
            return callback(err, context);
        }

        console.log('- fns:', fns);
        console.log('- upToIndex:', upToIndex);
        console.log('- length1:', fns[upToIndex].length);
        console.log('- length2:', fns.length);

        // if this is an error function, just skip to the next one
        // since we're not in an error state
        if ( fns[upToIndex].length > 2 ) {
            return process.nextTick(function() {
                doNext();
            });
        }

        console.log('upToIndex:', upToIndex);

        // call this function with the context
        console.log('doNext(): calling next myddleware at ' + upToIndex);
        fns[upToIndex](context, function(thisErr) {
            if (thisErr) {
                console.log('doNext(): got an error after calling the regular myddleware');
                err = thisErr;
                return doNextError();
            }

            console.log('doNext(): no error after calling the regular myddleware');

            // no error, so continue back on the regular chain and clear the error
            err = null;
            doNext();
        });
    }

    function doNextError() {
        console.log('doNextError(): entry');

        // incremement to the next function
        upToIndex = upToIndex + 1;

        // we're finished since there are no more fns
        if ( upToIndex === fns.length ) {
            console.log('doNextError(): calling callback');
            return callback(err, context);
        }

        console.log('- fns:', fns);
        console.log('- upToIndex:', upToIndex);
        console.log('- length1:', fns[upToIndex].length);
        console.log('- length2:', fns.length);

        // if this is a normal function, just skip to the next one
        // since we're currently in an error state
        if ( fns[upToIndex].length < 3 ) {
            return process.nextTick(function() {
                doNextError();
            });
        }

        console.log('upToIndex:', upToIndex);

        // call this function with the err and the context
        console.log('doNextError(): calling next myddleware at ' + upToIndex);
        fns[upToIndex](err, context, function(thisErr) {
            if (thisErr) {
                console.log('doNextError(): got an error after calling the error myddleware');
                err = thisErr;
                return doNextError();
            }
            // no error, so continue back on the regular chain and clear the error
            console.log('doNextError(): No error after calling the error myddleware');
            err = null;
            doNext();
        });
    }

    // kick things off
    doNext();
};

// ----------------------------------------------------------------------------
