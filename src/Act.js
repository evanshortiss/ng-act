(function(angular) {
    'use strict';

    // Ensure FH module is defined
    try {
        angular.module('FH')
    } catch (e) {
        angular.module('FH', []);
    }

    angular.module('FH').service('FH.Act', function($rootScope, $window) {
        // Error strings used for error type detection
        var ACT_ERRORS = {
            UNKNOWN_ACT: 'no such function',
            INTERNAL_ERROR: 'internal error in',
            TIMEOUT: 'timeout'
        };

        // Expose error types for checks by user
        var ERRORS = this.ERRORS = {
            UNKNOWN_ACT: 'UNKNOWN_ACT',
            CLOUD_ERROR: 'CLOUD_ERROR',
            TIMEOUT: 'TIMEOUT',
            NETWORK: 'NETWORK'
        };

        // Controls whether debug logging is enabled
        var printLogs = true;


        /**
         * Log debug output for this module.
         * @param {String}  str
         */
        function debug() {
            if(printLogs === true) {
                args = Array.prototype.slice.call(arguments);
                args.unshift('$fh.act ' + new Date().toISOString() + ': ');

                console.debug.apply(console, args);
            }
        }


        /**
         * Called on a successful act call (when main.js callback is called with a null error param)
         * It is assumed if a request could not be fulfilled res.errors will be defined.
         * @param {String}      actname
         * @param {Object}      res
         * @param {Function}    callback
         */
        function onSuccess(actname, res, callback) {
            // No response body maybe returned.
            // For example "return callback(null, null)" in the cloud
            debug('Called "' + actname + '" successfully.');

            return callback(null, res);
        }


        /**
         * Called when an act call has failed.
         * Tries to create a meaningful error string.
         * @param {String}      actname
         * @param {String}      err
         * @param {Object}      details
         * @param {Function}    callback
         */
        function onFail(actname, err, details, callback) {
            // TODO: More investigation into errors Act calls can return
            // Results from "console.log(err, msg)" below:
            // err              |           details
            // -------------------------------------
            // error_ajaxfail   | Object {status: 500, message: "error", error: "what you sent to main.js callback err param goes here!"}
            // error_ajaxfail   | Object {status: 0, message: "timeout", error: ""}

            debug('"' + actname + '" failed with errors:', details);

            // Not sure of other error types thrown
            if(err !== 'error_ajaxfail') {
                console.error('An unknown act call error occrued: ' + err, details);
                return callback('An unknown error occured during a request ( "' + err + '" ).');
            }

            else if(details.error.toLowerCase().indexOf(ACT_ERRORS.UNKNOWN_ACT) >= 0) {
                return callback(ERRORS.UNKNOWN_ACT, null);
            }

            else if(details.message.toLowerCase().indexOf(ACT_ERRORS.TIMEOUT) >= 0) {
                debug('Timeout occured calling ')
                return callback(ERRORS.TIMEOUT, null);
            }

            // Return error that cloud code sent to it's callback
            else {
                return callback(ERRORS.CLOUD_ERROR, null);
            }
        }


        /**
         * Call an action on the cloud.
         * @param {String}      actname
         * @param {Object}      params
         * @param {Function}    callback
         */
        this.callFn = function(actname, params, callback) {
            if(typeof params === 'function') {
                callback = params;
                params = {};
            }

            // Check are we online before trying the request
            if($window.navigator.onLine === true) {
                debug('Calling "' + actname + '" cloud side function.');
                $fh.act(opts, function(res) {
                    return onSuccess(actname, res, callback);
                }, function(err, msg) {
                    return onFail(actname, err, msg, callback);
                });
            } else {
                debug('Could not call "' + actname + '". No network connection.');
                return callback(ERRORS.NETWORK, null);
            }
        };


        // Disable internal logging by this service.
        this.disableLogging = function() {
            printLogs = false;
        };

        // Disable internal logging by this service.
        this.enableLogging = function() {
            printLogs = true;
        };
    });

})(window.angular);
