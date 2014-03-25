
// Act returns no error
exports.workingAct = function(params, callback) {
    return callback(null, {
        val: 'It worked!'
    });
};

// Act returns an error
exports.failingAct = function(params, callback) {
    return callback('An error occured', null);
};

// Act that times out
exports.timingOutAct = function(params, callback) {
    setTimeout(function() {
        return callback(null, {
            val: 'It finally worked, but you (the client) have given up waiting!'
        });
    }, (30 * 1000) );
};

// Return a data param passed in by a client
exports.paramPassing = function(params, callback) {
    return callback(null, {
        data: params.data
    });
};

// Act that doesn't return JSON out but has JSON content type
exports.invalidStringAct = function(params, callback) {
    return callback(null, 'Non JSON response!');
};
