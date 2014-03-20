
// Act returns no error
exports.workingAct = function(params, callback) {
    return callback(null, 'It worked!');
};

// Act returns an error
exports.failingAct = function(params, callback) {
    return callback('An error occured', null);
};

// Act that times out
exports.timingOutAct = function(params, callback) {
    setTimeout(function() {
        return callback(null, 'Finally!');
    }, (30 * 1000) );
};
