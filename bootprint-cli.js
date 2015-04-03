#!/usr/bin/env node

var program = require("commander");
var path = require("path");
var BootprintBuilder = require("./lib/bootprint-builder.js");
var _package = require("./package");

program.version(_package.version)
    .usage("[options] <module> <jsonFile> <targetdir>")
    .description(_package.description)
    .option('-f, --config-file <file>', 'Specify a config file for custom configurations', loadConfig, {})
    .option('-d, --development-mode', 'Turn on file-watcher, less source maps and http-server with live-reload')
    .option('-l, --long-stack', 'Turn on long and clarified stack-traces', enableLongStack)
    .parse(process.argv);

if (program.args.length < 2) {
    program.help();
}

// Options from commander
var templateModule = program.args[0];
var jsonFile = program.args[1];
var targetDir = program.args[2];
var options = program['configFile']; // Coerced by commander via fn-parameter
options.developmentMode = program["developmentMode"];

// Load and configure bootprint
try {
    var bootprint = require("./index.js")
        .load(requireTemplateModule(templateModule))
        .merge(options)
        .build(jsonFile, targetDir);
} catch (e) {
    console.error(e);
    process.exit(1);
}

// Generate HTML and CSS
bootprint.generate().then(function () {
    if (options.developmentMode) {
        require("../src/development-mode.js")(bootprint, jsonFile, targetDir);
    }
}).done(function () {
    console.log("done");
});

/**
 * Load the template module. Try loading "bootprint-`moduleName`" first. If it does not exist
 * use "`moduleName`" directly as module-name.
 * @param moduleName {string} the name of the module to load
 * @return {function} the builder-function of the loaded module
 * @throws an error if neither `bootprint-moduleName` nor `moduleName` refer to an existing module.
 */
function requireTemplateModule(moduleName) {
    var templateModul = null;
    try {
        templateModul = require("bootprint-" + moduleName);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            templateModul = require(moduleName);
        } else {
            throw e;
        }
    }
    return templateModul;
}

/**
 * Enable long-stack-support
 */
function enableLongStack() {
    Error.stackTraceLimit = 100;
    require("trace");
    require("clarify");
}

/**
 * Load a the contents of a configuration file (by `require`ing it)
 * @param configFile
 * @returns {object} the configuration object
 */
function loadConfig(configFile) {
    return require(path.resolve(configFile));
}
