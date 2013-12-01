// ----------------------------------------------------------------------------

// npm
var test = require('tape');

// local
var myddle = require('../');

// ----------------------------------------------------------------------------

test('just one function', function(t) {
    var ctx = {};
    myddle([ nextOkay1 ], ctx, function(err) {
        t.ok(!err, 'There is no error');
        t.end();
    });
});

test('just two functions', function(t) {
    var ctx = {};
    myddle([ nextOkay1, nextOkay2 ], ctx, function(err) {
        t.ok(!err, 'There is no error');
        t.end();
    });
});

// ----------------------------------------------------------------------------
// helper functions

function nextOkay1(context, next) {
    process.nextTick(function() {
        next();
    });
}

function nextOkay2(context, next) {
    process.nextTick(function() {
        next();
    });
}

// ----------------------------------------------------------------------------
