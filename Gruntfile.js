"use strict";
module.exports = function(grunt) {

    grunt.initConfig({
        jsdoc2md: {
            apidoc: {
                src: ["src/Bootprint.js", "src/BootprintBuilder.js" ],
                dest: "doc/api.md"
            }
        }
    });

    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    grunt.registerTask("default", "jsdoc2md");
};