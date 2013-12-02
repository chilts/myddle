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

test('just one function', function(t) {
    myddle({}, [ nextOkay1 ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.end();
    });
});

test('just two functions', function(t) {
    myddle({}, [ nextOkay1, nextOkay2 ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.ok(ctx.nextOkay2, 'nextOkay2 was called');
        t.end();
    });
});

test('just one function, no context', function(t) {
    myddle([ nextOkay1 ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.end();
    });
});

test('just two functions, no context', function(t) {
    myddle([ nextOkay1, nextOkay2 ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.ok(ctx.nextOkay2, 'nextOkay2 was called');
        t.end();
    });
});

test('just one function, error myddleware not called', function(t) {
    var ctx = {
        t : t,
    };
    myddle(ctx, [ nextOkay1, errorNotCalled ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.end();
    });
});

test('just two functions, error myddleware not called at end', function(t) {
    var ctx = {
        t : t,
    };
    myddle(ctx, [ nextOkay1, nextOkay2, errorNotCalled ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.ok(ctx.nextOkay2, 'nextOkay2 was called');
        t.end();
    });
});

test('just two functions, error myddleware not called in middle', function(t) {
    var ctx = {
        t : t,
    };
    myddle(ctx, [ nextOkay1, errorNotCalled, nextOkay2 ], function(err, ctx) {
        t.ok(!err, 'There is no error');
        t.ok(ctx.nextOkay1, 'nextOkay1 was called');
        t.ok(ctx.nextOkay2, 'nextOkay2 was called');
        t.end();
    });
});

// ----------------------------------------------------------------------------
// helper functions

function nextOkay1(context, next) {
    process.nextTick(function() {
        context.nextOkay1 = true;
        next();
    });
}

function nextOkay2(context, next) {
    process.nextTick(function() {
        context.nextOkay2 = true;
        next();
    });
}

function errorNotCalled(err, context, next) {
    context.t.fail('This error middleware should not be called');
}

// ----------------------------------------------------------------------------
