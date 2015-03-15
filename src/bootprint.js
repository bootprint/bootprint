var Handlebars = require('handlebars');
var qfs = require("q-io/fs");
var qhttp = require("q-io/http");
var Q = require("q");
var path = require("path");
var less = require("less");
var _ = require("lodash");
var deep = require("q-deep");
var debug = require("debug")("bootprint");
var loadPartials = require("./load-partials.js");


function loadFromFileOrHttp(fileOrUrl) {
    if (fileOrUrl.match(/^https?:\/\//)) {
        return qhttp.read(fileOrUrl);
    } else {
        return qfs.read(fileOrUrl);
    }
}


function Bootprint(jsonFile, options, targetDir) {

    debug("Creating Bootprint", jsonFile, options, targetDir);
    // Visible field with actual options needed by developmentMode
    this.options = options;

    /**
     * Generate html-output and store the result into the index.html-file in the specified target directory
     * @returns {*}
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
            debug("Registering partials", partials);
            hbs.registerPartial(partials);
            debug("Partials registered");
            return hbs
        });

        // When all is ready, do the work
        return Q.all([pageTemplateP, handleBarsP, jsonP, targetDirP])
            .spread(function (pageTemplateContents, HtmlHandlebars, json) {
                debug("compiling pageTemplate");
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
     * Generate css, with optional additional theme-less-file. From bootstrap less and atom-light-syntax less
     * @returns {*}
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

    this.generate = function() {
        debug("Generating HTML and CSS");
        return Q.all([this.generateHtml(),this.generateCss()]);
    }
}

module.exports = Bootprint;


