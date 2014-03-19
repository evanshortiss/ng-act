# ng-act
A wrapper for $fh.act to be used with Angular.

## Notes / TODO
To use it you'll need to require the FH module for your Angular application. In this way more Angular wrappers can be built for other services in the FH namespace.
This was developed as a service for part of a different project. I've made it into a Angular module here but it is untested in this form and the namespacing may cause the import to break so feel free to fork and fix!

## Usage
To use it you'll need to require the FH module for your Angular application and have included the FeedHenry JS SDK.

Unlike the standard usage for $fh.act this module accepts only a single callback and follows the node.js callback style with an error being the first parameter.

Here's an example of how you could use Act within a service.

```
angular.module('MyApp', ['FH']).config(function() {

});


angular.module('MyApp').service('MyService', ['FH.Act', function(Act) {

    this.someFunction = function(form) {
        Act.callFn('myAct', {
            data: 'Sample Data'
        }, function(err, res) {
            // err is an object with format
            // {
            //    type: String,
            //    err: String,
            //    msg: Object
            // }

            if (err) {
                if(err.type === Act.ERRORS.NO_NETWORK) {
                    // Inform user of error
                }
                // etc...
            } else {
                // It worked!
            }
        });
    };

}]);
```

## API

### callFn(actName, [params,] callback)
Call an Act with the given name, params are optional. Callback has the format _function(err, res)_.

### disableLogging
Stop debug info being printed to the console.

### enableLogging
Restart debug info being printed to the console.

### ERRORS
These are exposed so you can identify the reason for an error.

##### ERRORS.UNKNOWN_ERROR
When an error occurs that can't be identified.

##### ERRORS.UNKNOWN_ACT
The actname provided is not exposed in main.js.

##### ERRORS.CLOUD_ERROR
Represents an error occuring in the cloud code being called. This occurs if you return
an error to the main.js callback function.

##### ERRORS.TIMEOUT
Call did not receive a response in timely fashion.

##### ERRORS.NO_NETWORK
Occurs when the device has no network (3G / Wifi) connection.
