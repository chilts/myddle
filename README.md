myddle - Context carrying Middleware for regular functions, with error handlers.

## Synopsis ##

```
var myddle = require('myddle');

myddle([ fn1, fn2, ...], context, function(err) {
    // called when all functions have been called
});
```

Each middleware function has the signature:

```
function fn1(context, done) {
    // ... do something and store result in context
    return done();
}
```

And every single function will receive the context when called.

## Errors ##

If `done()` is called with an error, then the regular middleware functions are skipped over and any
error handler middlewares are called with the error. Each error handler middleware has the following signature:

```
function fn1(err, context, done) {
    // ... do something and store result in context

    // to propagate the error (or send a new one), call done with it
    return done(err);

    // or

    // to cancel the error call done without any error
    return done();
}
```

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
