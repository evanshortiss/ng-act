'use strict';

var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mocha_phantomjs: {
            all: [path.join(__dirname, 'test/client/default/index.html')]
        },

        jshint: {
            with_overrides: {
                options: {
                    "browser": true,
                    "node": false,
                    "jquery": false,
                    "debug": true,
                    "devel": true,
                    "asi": false,
                    "laxbreak": false,
                    "laxcomma": false,
                    "bitwise": true,
                    "boss": true,
                    "curly": true,
                    "eqeqeq": true,
                    "eqnull": false,
                    "evil": false,
                    "forin": false,
                    "immed": true,
                    "latedef": true,
                    "loopfunc": true,
                    "noarg": true,
                    "regexp": false,
                    "regexdash": false,
                    "scripturl": true,
                    "shadow": true,
                    "supernew": false,
                    "undef": true,
                    "unused": true,
                    "newcap": true,
                    "noempty": true,
                    "nonew": true,
                    "nomen": false,
                    "onevar": false,
                    "quotmark": "single",
                    "plusplus": false,
                    "strict": true,
                    "sub": true,
                    "trailing": true,
                    "white": false,
                    "indent": 4,
                    "maxparams": 5,
                    "maxdepth": 5,
                    "maxstatements": 20,
                    "maxcomplexity": 14
                },
                files: {
                    src: [path.join(__dirname, '/src/Act.js')]
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint:with_overrides', 'mocha_phantomjs']);
    grunt.registerTask('mocha', ['mocha_phantomjs']);

};
