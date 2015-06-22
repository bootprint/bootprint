var Handlebars = require('handlebars');
var qfs = require("q-io/fs");
var Q = require("q");
var path = require("path");
var less = require("less");
var _ = require("lodash");
var debug = require("debug")("bootprint:core");
var loadPartials = require("./read-partials.js");
var http = require('http');
var httpGet = require('get-promise');


/**
 * This class is the programmatic interface to building HTML from the json
 * file. A pre-configured instance of this class can be obtained from
 * the [BootprintBuilder](#BootprintBuilder) (i.e. via `require('bootprint')`)
 * @class
 * @see BootprintBuilder
 */
function Bootprint(jsonFile, options, targetDir) {

    function loadFromFileOrHttp(fileOrUrlOrData) {
        // If this is not a string,
        // it is probably already the raw data.
        if (!_.isString(fileOrUrlOrData)) {
            return fileOrUrlOrData;
        }
        // otherwise load data from url or file
        if (fileOrUrlOrData.match(/^https?:\/\//)) {
            // Use the "request" package to download data
            return httpGet(fileOrUrlOrData).then(function(result) {
                if (result.status !== 200) {
                    var error = new Error("HTTP request failed with code " + result.status);
                    error.result = result;
                    throw error;
                }
                return result.data;
            });
        } else {
            return qfs.read(fileOrUrlOrData);
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
        // Read handlebars-options
        var hbsOptions = options.handlebars;
        debug("Generating HTML from %s", hbsOptions.template);
        var pageTemplateP = qfs.read(hbsOptions.template);
        var targetDirP = qfs.makeTree(targetDir);

        var jsonP = loadFromFileOrHttp(jsonFile)
            .then(JSON.parse)
            .then(function (json) {
                return options.preprocessor(json);
            });

        var handleBarsP = loadPartials(hbsOptions.partials).then(function (partials) {
            debug("Partials loaded");
            var hbs = Handlebars.create();
            debug("Handlbars instance created");
            hbs.logger.level = 0;
            // Provide the engine as last parameter to all helpers in order to
            // enable things like calling partials from a helper.
            hbs.registerHelper(_.mapValues(hbsOptions.helpers, function (helper) {

                return _.partialRight(helper, {
                    engine: hbs,
                    config: hbsOptions
                });
            }));
            debug("Handlebars helpers registered");
            debug("Registering partials");
            hbs.registerPartial(partials);
            debug("Partials registered");
            return hbs
        });

        // When all is ready, do the work
        return Q.all([pageTemplateP, handleBarsP, jsonP, targetDirP])
            .spread(function (pageTemplateContents, HtmlHandlebars, json) {
                debug("compiling pageTemplate", pageTemplateContents);
                try {

                    var pageTemplate = HtmlHandlebars.compile(pageTemplateContents, {
                        trackIds: true,
                        preventIndent: true
                    });
                    var targetFile = path.join(targetDir, hbsOptions.targetFile || "index.html");
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
        if (!options.less || !options.less.main || options.less.main.length == 0) {
            return null;
        }
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


