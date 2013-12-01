var myddle = require('../');
var test = require('tape');

function error1(context, next) {
    process.nextTick(function() {
        next('this is an error');
    });
}

test('got an error immediately', function(t) {
    var ctx = {};
    myddle([ error1 ], ctx, function(err) {
        t.ok(err, 'There is an error');
        t.equal(err, 'this is an error', 'error is correct');
        t.end();
    });
});

