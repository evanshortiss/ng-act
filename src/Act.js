(function(angular) {
    'use strict';

    // Ensure FH module is defined
    try {
        angular.module('FH');
    } catch (e) {
        angular.module('FH', ['ng']);
    }

    angular.module('FH').service('FH.Act', function($rootScope, $q, $timeout, $window) {
        // Error strings used for error type detection
        var ACT_ERRORS = {
            PARSE_ERROR: 'parseerror',
            NO_ACTNAME: 'act_no_action',
            UNKNOWN_ACT: 'no such function',
            INTERNAL_ERROR: 'internal error in',
            TIMEOUT: 'timeout'
        };

        // Expose error types for checks by user
        var ERRORS = this.ERRORS = {
            NO_ACTNAME_PROVIDED: 'NO_ACTNAME_PROVIDED',
            UNKNOWN_ERROR: 'UNKNOWN_ERROR',
            UNKNOWN_ACT: 'UNKNOWN_ACT',
            CLOUD_ERROR: 'CLOUD_ERROR',
            TIMEOUT: 'TIMEOUT',
            PARSE_ERROR: 'PARSE_ERROR',
            NO_NETWORK: 'NO_NETWORK'
        };

        // Controls whether debug logging is enabled
        var printLogs = true;
        // Default time to wait for response
        var defaultTimeout = 20 * 1000;


        /**
         * Log debug output for this module.
         * @param {String}  str
         */
        function debug() {
            if(printLogs === true) {
                var args = Array.prototype.slice.call(arguments);
                args[0] = '$fh.act ' + new Date().toISOString() + ': ' + args[0];

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
        function parseSuccess(actname, res) {
            debug('Called "' + actname + '" successfully.');

            return res;
        }


        /**
         * Called when an act call has failed.
         * Tries to create a meaningful error string.
         * @param {String}      actname
         * @param {String}      err
         * @param {Object}      details
         * @param {Function}    callback
         */
        function parseFail(actname, err, details) {
            var ERR = null;

            if (err !== 'error_ajaxfail') {
                ERR = ERRORS.UNKNOWN_ERROR;
            } else if (err === ERRORS.NO_ACTNAME_PROVIDED) {
                ERR = ERRORS.NO_ACTNAME_PROVIDED;
            } else if (details.error.toLowerCase().indexOf(ACT_ERRORS.UNKNOWN_ACT) >= 0) {
                ERR = ERRORS.UNKNOWN_ACT;
            } else if (details.message.toLowerCase().indexOf(ACT_ERRORS.TIMEOUT) >= 0) {
                ERR = ERRORS.TIMEOUT;
            } else if (details.message === ACT_ERRORS.PARSE_ERROR) {
                ERR = ERRORS.PARSE_ERROR;
            } else {
                // Cloud code sent error to it's callback
                debug('"%s" encountered an error in it\'s cloud code. Error String: %s, Error Object: %o', actname, err, details);
                ERR = ERRORS.CLOUD_ERROR;
            }

            debug('"%s" failed with error %s', actname, ERR);

            return {
                type: ERR,
                err: err,
                msg: details
            };
        }


        function safeApply(fn) {
            var phase = $rootScope.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            }
            else {
                $rootScope.$apply(fn);
            }
        }


        /**
         * Returns a successful act call.
         * @param {Mixed} res
         * @param {Promise} [promise]
         * @param {Function} [callback]
         */
        function resolve(res, promise, callback) {
            safeApply(function() {
                if (callback) {
                    callback(null ,res);
                } else {
                    promise.resolve(res);
                }
            });
        }


        /**
         * Returns a failed act call.
         * @param {Mixed} res
         * @param {Promise} [promise]
         * @param {Function} [callback]
         */
        function reject(err, promise, callback) {
            safeApply(function() {
                if (callback) {
                    callback(err, null);
                } else {
                    promise.reject(err);
                }
            });
        }


        /**
         * Call an action on the cloud.
         * @param {String}      actname
         * @param {Object}      [params]
         * @param {Function}    [callback]
         */
        this.callFn = function(actname, params, callback, timeout) {
            var promise = null;

            if (!callback && typeof params !== 'function') {
                // User is not using callbacks (wants to use promises)
                promise = $q.defer();
            } else if (typeof params === 'function') {
                // User is using callbacks
                callback = params;
                params = null;
            }

            // $fh.act parameters object
            var opts = {
                act: actname,
                req: params,
                timeout: timeout || defaultTimeout
            };

            // Check are we online before trying the request
            // For unit tests simply assume we have a connection
            if ($window.navigator.onLine === true || window.mochaPhantomJS) {
                debug('Calling "' + actname + '" cloud side function.');

                $fh.act(opts, function(res) {
                    resolve(parseSuccess(actname, res), promise, callback);
                }, function(err, msg) {
                    reject(parseFail(actname, err, msg), promise, callback);
                });
            } else {
                debug('Could not call "' + actname + '". No network connection.');

                $timeout(function(){
                    reject({
                        type: ERRORS.NO_NETWORK,
                        err: null,
                        msg: null
                    }, promise, callback);
                }, 0);
            }

            if(promise !== null) {
                return promise.promise;
            }
        };

        this.setDefaultTimeout = function(timeout) {
            defaultTimeout = t;
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
