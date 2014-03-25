'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mocha_phantomjs: {
            all: ['test/client/default/index.html']
        }
    });

    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('test', ['mocha_phantomjs']);

};
