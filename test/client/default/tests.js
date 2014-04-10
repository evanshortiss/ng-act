(function() {
    var expect = chai.expect;
    var assert = chai.assert;
    var $injector = angular.injector(['FH']);
    var Act = $injector.get('FH.Act');
    var randNumber = Math.random();

    before(function() {
        $fh.app_props = {
            mode: 'dev'
        };
        $fh.cloud_props = {
            hosts: {
                debugCloudUrl: 'http://127.0.0.1:8001',
                liveCloudUrl: 'http://127.0.0.1:8001'
            }
        };
    })

    describe('Test FH.Act Angular Module', function() {
        this.timeout(25 * 1000);

        it('Check angular and $fh is defined', function() {
            assert.ok(window.angular);
            assert.ok(window.$fh);
        });

        Act.disableLogging();

        describe('Valid act calls that receive a response', function() {
            // Cloud success responses
            it('Should make a valid act call using a callback', function(done) {
                Act.callFn('workingAct', function(err, res) {
                    expect(err).to.equal(null);
                    assert.equal(typeof res, 'object', 'Respone should parse to an object.');
                    expect(res.val).to.equal('It worked!');
                    done();
                });
            });

            it('Should make a valid act call using promises', function(done) {
                Act.callFn('workingAct').then(function(res) {
                    assert.equal(typeof res, 'object', 'Respone should parse to an object.');
                    expect(res.val).to.equal('It worked!');
                    done();
                });
            });

            // Cloud error responses
            it('Should call an endpoint that returns an error and handle the error', function(done) {
                Act.callFn('failingAct', function(err, res) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.CLOUD_ERROR);
                    done();
                });
            });

            it('Should call an endpoint that returns an error using promises and hadle the error', function(done) {
                Act.callFn('failingAct').then(function(res) {
                    done(new Error('Act should have failed out!'));
                }, function(err) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.CLOUD_ERROR);
                    done();
                });
            });


            // TIMING OUT ACT CALLS
            it('Should make a valid act call to a timing out endpoint and handle the error', function(done) {
                Act.callFn('timingOutAct', null, function(err, res) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.TIMEOUT);
                    done();
                }, 100);
            });

            it('Should make a valid act call to a timing out endpoint using promises and handle the error', function(done) {
                Act.callFn('timingOutAct', null, null, 100).then(function(res) {
                    throw new Error('Act should have timed out!');
                }, function(err) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.TIMEOUT);
                    done();
                });
            });


            // PARAMETERS TESTING
            it('Should make a valid act call to a timing out endpoint and handle the error', function(done) {
                Act.callFn('paramPassing', {
                    data: randNumber
                }, function(err, res) {
                    expect(res).to.be.an('object');
                    expect(res.data).to.be.a('number');
                    expect(res.data).to.equal(randNumber);
                    done();
                }, 100);
            });

            it('Should make a valid act call to a timing out endpoint using promises and handle the error', function(done) {
                Act.callFn('paramPassing', {
                    data: randNumber
                }, null, 100).then(function(res) {
                    expect(res).to.be.an('object');
                    expect(res.data).to.be.a('number');
                    expect(res.data).to.equal(randNumber);
                    done();
                }, function(err) {
                    done(new Error('Act should have worked!'));
                });
            });
        });


        describe('Act calls that are invalid and cloud app doesn\t respond to or sends a malformed response', function() {
            // NON-EXISTENT ACT CALL
            it('Should try call to a non-existent endpoint and receive an error', function(done) {
                Act.callFn('someFakeActName', function(err, res) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.UNKNOWN_ACT);
                    done();
                });
            });

            it('Should try call to a non-existent endpoint using promises and receive an error', function(done) {
                Act.callFn('someFakeActName').then(function(res) {
                    done(new Error('Act should have timed out!'));
                }, function(err) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.UNKNOWN_ACT);
                    done();
                });
            });


            // ACT CALL THAT DOESN'T RETURN JSON BUT HAS CONTENT-TYPE OF JSON
            it('Act call to an endpoint that doesn\'t return JSON but has Content-Type of JSON, causes error.', function(done) {
                Act.callFn('invalidStringAct', function(err, res) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.PARSE_ERROR);
                    done();
                });
            });

            it('Act call to an endpoint that doesn\'t return JSON but has Content-Type of JSON using promises, causes an error', function(done) {
                Act.callFn('invalidStringAct').then(function(res) {
                    done(new Error('Act should have timed out!'));
                }, function(err) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.PARSE_ERROR);
                    done();
                });
            });


            // PROVIDE NO ACTNAME
            it('Call Act.callFn without providing an Act name.', function(done) {
                Act.callFn(null, function(err, res) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.NO_ACTNAME_PROVIDED);
                    done();
                });
            });

            it('Call Act.callFn without providing an Act name using promises', function(done) {
                Act.callFn(null).then(function(res) {
                    done(new Error('Act should have timed out!'));
                }, function(err) {
                    expect(err).to.be.an('object');
                    expect(err.type).to.equal(Act.ERRORS.NO_ACTNAME_PROVIDED);
                    done();
                });
            });
        });
    });

})();
