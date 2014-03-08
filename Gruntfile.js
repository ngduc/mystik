module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        jshint : {
            files : [
                'Gruntfile.js',
                'app/**/*.js',
                'test/**/*.js'
            ],
            options: {
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', 'execute jasmine unit tests', function() {
        var shell = require('shelljs');
        shell.exec('jasmine-node --forceexit ./test/');
    });

    grunt.registerTask('default', ['jshint']);
};
