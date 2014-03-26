# ng-act
A wrapper for $fh.act to be used with Angular. Available via bower:

```
bower install ng-act --save
```

## Usage
To use it you'll need to require the FH module for your Angular application (see below) and also
have included the [FeedHenry JS SDK](https://github.com/feedhenry/fh-js-sdk/) in your project.

Unlike the standard usage for $fh.act this module accepts only a single
callback and follows the node.js callback style with an error being the first parameter.
If you wish you can also use a promise style with this service, simply don't provide
a callback parameter when calling an act and an AngularJS promise is returned.

Here's an example of how you could use Act within a service.

```
angular.module('MyApp', ['FH']).config(function() {

});


angular.module('MyApp').service('MyService', ['FH.Act', function(Act) {

    this.someFunction = function() {
        // Do an act call with callback and timeout of 5000
        Act.callFn('myAct', {
            str: 'Sample String'
        }, function(err, res) {
            if (err) {
                if(err.type === Act.ERRORS.NO_NETWORK) {
                    // Inform user of error
                }
                // etc...
            } else {
                // It worked!
            }
        }, 5000);

        // Do an act call using promise and timeout of 5000
        Act.callFn('myAct', {
            str: 'Sample String'
        }, null, 5000).then(function(res) {
            // It worked!
        }, function(err) {
            // Darn...something went wrong
        });
    };

}]);
```

## Tests
To run tests run ```npm install``` in the root directory.

Run ```npm install``` in the __test/cloud__ directory.

Run ```bower install``` in the __test/client/default__ directory.

Go to __test/cloud/__ and run ```node application.js```

Now you can open __test/client/default/index.html__ or run ```grunt test``` from the root directory
to run tests using PhantomJS so long as application.js is running.


## API

### callFn(actName[, params [, callback], [timeout]])
Call an Act with the given name. The params, callback and timeout parameters are optional. If no callback is provided a promise is returned. If a callback is provided it has the format _function(err, res)_.

### setDefaultTimeout(milliseconds)
Set a default timeout in milliseconds for all Act calls.

### disableLogging()
Stop debug info being printed to the console.

### enableLogging()
Restart debug info being printed to the console.

### ERRORS
These are exposed on the Act.ERRORS object so you can identify the reason for an error.

##### ERRORS.NO_ACTNAME_PROVIDED
Indicates that no act name was provided to the call.

##### ERRORS.UNKNOWN_ERROR
When an error occurs that can't be identified.

##### ERRORS.PARSE_ERROR
Occurs when a non JSON response is provided to a cloud callback.

##### ERRORS.UNKNOWN_ACT
The act name provided is not exposed in main.js.

##### ERRORS.CLOUD_ERROR
Indicates an error occurred in the cloud code being called. This occurs if you return
an error to the main.js callback function.

##### ERRORS.TIMEOUT
Call did not receive a response within the expected timeframe.

##### ERRORS.NO_NETWORK
Occurs when the device has no network (3G / Wifi) connection.
