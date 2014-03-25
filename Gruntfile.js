'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mocha_phantomjs: {
            all: ['test/client/default/index.html']
        },

        jshint: {
            with_overrides: {
                options: {
                    "browser": true, // Standard browser globals e.g. `window`, `document`.
                    "node": false,
                    "jquery": false,

                    // Development.
                    "debug": false, // Allow debugger statements e.g. browser breakpoints.
                    "devel": true, // Allow developments statements e.g. `console.log();`.

                    // The Good Parts.
                    "asi": false, // Tolerate Automatic Semicolon Insertion (no semicolons).
                    "laxbreak": false, // Tolerate unsafe line breaks e.g. `return [\n] x` without semicolons.
                    "laxcomma": false, // Allow a line beginning with a comma
                    "bitwise": true, // Prohibit bitwise operators (&, |, ^, etc.).
                    "boss": true, // Tolerate assignments inside if, for & while. Usually conditions & loops are for comparison, not assignments.
                    "curly": true, // Require {} for every new block or scope.
                    "eqeqeq": true, // Require triple equals i.e. `===`.
                    "eqnull": false, // Tolerate use of `== null`.
                    "evil": false, // Tolerate use of `eval`.
                    "forin": false, // Tolerate `for in` loops without `hasOwnPrototype`.
                    "immed": true, // Require immediate invocations to be wrapped in parens e.g. `( function(){}() );`
                    "latedef": true, // Prohibit variable use before definition.
                    "loopfunc": true, // Allow functions to be defined within loops.
                    "noarg": true, // Prohibit use of `arguments.caller` and `arguments.callee`.
                    "regexp": false, // Prohibit `.` and `[^...]` in regular expressions.
                    "regexdash": false, // Tolerate unescaped last dash i.e. `[-...]`.
                    "scripturl": true, // Tolerate script-targeted URLs.
                    "shadow": true, // Allows re-define variables later in code e.g. `var x=1; x=2;`.
                    "supernew": false, // Tolerate `new function () { ... };` and `new Object;`.
                    "undef": true, // Require all non-global variables be declared before they are used.
                    "unused": true, // Prohibit unused variables

                    // Styling preferences.
                    "newcap": true, // Require capitalization of all constructor functions e.g. `new F()`.
                    "noempty": true, // Prohibit use of empty blocks.
                    "nonew": true, // Prohibit use of constructors for side-effects.
                    "nomen": false, // Prohibit use of initial or trailing underscores in names.
                    "onevar": false, // Allow only one `var` statement per function.
                    "quotmark": "single", // ensure all strings are wrapped in single quotes
                    "plusplus": false, // Prohibit use of `++` & `--`.
                    "strict": true,
                    "sub": true, // Tolerate all forms of subscript notation besides dot notation e.g. `dict['key']` instead of `dict.key`.
                    "trailing": true, // Prohibit trailing whitespaces.
                    "white": false, // Check against strict whitespace and indentation rules.
                    "indent": 4, // Specify indentation spacing

                    // Maximum values
                    "maxparams": 5, // max allowed params per function
                    "maxdepth": 5, // max nesting level
                    "maxstatements": 20, // max statements per function
                    "maxcomplexity": 14, // max independent logical paths through a function
                },
                files: {
                    src: ['./src/Act.js']
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint:with_overrides', 'mocha_phantomjs']);

};
