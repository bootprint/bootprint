var Handlebars = require('handlebars');
var qfs = require("q-io/fs");
var Q = require("q");
var path = require("path");
var less = require("less");
var _ = require("lodash");
var deep = require("q-deep");
var debug = require("debug")("bootprint:core");
var loadPartials = require("./readPartials.js");
var request = require('request');


/**
 * This class is the programmatic interface to building HTML from the json
 * file. A pre-configured instance of this class can be obtained from
 * the [BootprintBuilder](#BootprintBuilder) (i.e. via `require('bootprint')`)
 * @class
 * @see BootprintBuilder
 */
function Bootprint(jsonFile, options, targetDir) {



    function loadFromFileOrHttp(fileOrUrl) {
            if (fileOrUrl.match(/^https?:\/\//)) {
            // Use the "request" package to download data
            return Q.nfcall(request, fileOrUrl).spread(function (response) {
                if (response.statusCode !== 200) {
                    var error = new Error("HTTP request failed with code " + response.statusCode);
                    error.response = response;
                    throw error;
                }
                return response.body;
            });
        } else {
            return qfs.read(fileOrUrl);
        }
    }
    
    debug("Creating Bootprint", jsonFile, options, targetDir);
    // Visible field with actual options needed by developmentMode
    this.options = options;

    /**
     * Generates html-output and store the result into the index.html-file
     * in the specified target directory.
     * @returns {Promise} a promise that resolves to the index.html-file
     * when all content is generated and stored.
     */
    this.generateHtml = function () {
        debug("Generating HTML from %s", options.template);
        var pageTemplateP = qfs.read(options.template);
        var targetDirP = qfs.makeTree(targetDir);

        var jsonP = loadFromFileOrHttp(jsonFile)
            .then(JSON.parse)
            .then(function (json) {
                return options.preprocessor(json);
            });

        var handleBarsP = loadPartials(options.partials).then(function (partials) {
            debug("Partials loaded");
            var hbs = Handlebars.create();
            debug("Handlbars instance created");
            hbs.logger.level = 0;
            hbs.registerHelper(options.helpers);
            debug("Handlebars helpers registered");
            debug("Registering partials");
            hbs.registerPartial(partials);
            debug("Partials registered");
            return hbs
        });

        // When all is ready, do the work
        return Q.all([pageTemplateP, handleBarsP, jsonP, targetDirP])
            .spread(function (pageTemplateContents, HtmlHandlebars, json) {
                debug("compiling pageTemplate",pageTemplateContents);
                try {

                    var pageTemplate = HtmlHandlebars.compile(pageTemplateContents, {
                        trackIds: true,
                        preventIndent: true
                    });
                    var targetFile = path.join(targetDir, "index.html");
                    var content = pageTemplate(json);
                    return qfs.write(targetFile, content).then(function () {
                        return targetFile;
                    });
                } catch (e) {
                    console.log(e);
                    throw e;
                }
            });
    };

    /**
     * Generates the CSS from all configured less-files.
     * @returns {Promise} a promise that is resolved to the target css-file when
     *   the CSS-compilation is finished.
     */
    this.generateCss = function () {
        debug("Generating CSS");
        var mainCss = path.join(targetDir, "main.css");
        var targetDirProm = qfs.makeTree(targetDir);
        return Q.all([targetDirProm]).then(function () {
            var lessSource = options.less.main.map(function (file) {
                return '@import "' + file + '";'
            }).join("\n");
            return less.render(lessSource, {
                sourceMap: options.developmentMode && {sourceMapFileInline: true, outputSourceFiles: true},
                paths: options.less.paths,
                filename: "main.less", // Specify a filename, for better error messages
                compress: true
            });

        }).then(function (lessResult) {
            return Q.all([
                qfs.write(mainCss, lessResult.css)
            ]);
        }).then(function () {
            return mainCss;
        });
    };

    /**
     * Perform the complete build (i.e. {@link Bootprint#generateCss()}
     * and {@link Bootprint#generateHtml()})
     * @returns {Promise} a promise that is resolved to an array when both tasks are complete.
     * The array contains the path to "index.html" at index 0 and the "main.css" at index 1.
     */
    this.generate = function () {
        debug("Generating HTML and CSS");
        return Q.all([this.generateHtml(), this.generateCss()]);
    }
}

module.exports = Bootprint;


