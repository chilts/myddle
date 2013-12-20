```
                  .___  .___.__          
  _____ ___.__. __| _/__| _/|  |   ____  
 /     <   |  |/ __ |/ __ | |  | _/ __ \ 
|  Y Y  \___  / /_/ / /_/ | |  |_\  ___/ 
|__|_|  / ____\____ \____ | |____/\___  >
      \/\/         \/    \/           \/ 

```

Context carrying Middleware for regular functions, with error handlers. Kinda like Connect/Express middleware but
without the HTTP request/resonse. Or thinking about it another way, like async#applyEachSeries but with error
functions.

[![Build Status](https://api.travis-ci.org/chilts/myddle.png)](https://api.travis-ci.org/chilts/myddle.png)

## Synopsis ##

```
var myddle = require('myddle');

myddle({}, [ fn1, fn2, ...], function(err) {
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

You can pass a context to start off with, or it will default to `{}`:

```
// equivalent
myddle({}, [ fn1, fn2, ...], function(err, context) {
    // ...
});

// same as above
myddle([ fn1, fn2, ...], function(err, context) {
    // ...
});
```

In all cases, the final function is called in the standard Node.js way, with `err` as the first argument. Whether `err`
is set or not, the current `context` is always passed as the second argument.

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
