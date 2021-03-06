// ----------------------------------------------------------------------------
//
// Copyright 2013 Andrew Chilton. All Rights Reserved.
//
// License: MIT - http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------

// npm
var test = require('tape');

// local
var myddle = require('../');

// ----------------------------------------------------------------------------
// tests

test('got an error immediately', function(t) {
    var ctx = {};
    myddle(ctx, [ error1 ], function(err, ctx) {
        t.ok(err, 'There is an error');
        t.equal(err, 'this is an error', 'error is correct');
        t.end();
    });
});

test('got error, no further middleware called', function(t) {
    var ctx = {};
    myddle(ctx, [
        error1,
        function(ctx, done) {
            t.fail('This myddleware should never have been called');
        }
    ], function(err, ctx) {
        t.ok(err, 'There is an error');
        t.equal(err, 'this is an error', 'error is correct');
        t.end();
    });
});

test('two error myddlewares, both called', function(t) {
    var ctx = {
        t : t,
    };
    myddle(ctx, [ error1, handleError1, handleError2 ], function(err, ctx) {
        t.ok(err, 'There is an error');
        t.equal(err, 'the final error', 'error is correct');
        t.end();
    });
});

test('two error myddlewares, first consumes the error', function(t) {
    t.plan(2);

    var ctx = {
        t : t,
    };
    myddle(
        ctx,
        [
            error1,
            consumeError,
            function(ctx, next) {
                ctx.t.pass('Yes, inside regular middleware after the error has been consumed');
                next();
            }
        ],
        function(err, ctx) {
            t.ok(!err, 'There is no error');
            t.end();
        }
    );
});

// ----------------------------------------------------------------------------
// helpers

function error1(context, next) {
    process.nextTick(function() {
        next('this is an error');
    });
}

function handleError1(err, context, next) {
    console.log('=== context ===', context);
    process.nextTick(function() {
        context.t.equal(err, 'this is an error', 'The error passed to handleError() is correct');
        next('a different error');
    });
}

function handleError2(err, context, next) {
    process.nextTick(function() {
        context.t.equal(err, 'a different error', 'The error passed to handleError() is correct');
        next('the final error');
    });
}

function consumeError(err, context, next) {
    console.log('=== context ===', context);
    process.nextTick(function() {
        next();
    });
}

// ----------------------------------------------------------------------------
