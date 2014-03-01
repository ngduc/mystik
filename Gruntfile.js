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

    grunt.registerTask('default', ['jshint']);
};
