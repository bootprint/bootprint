#!/usr/bin/env node

var program = require("commander");
var Q = require("q");
var debug = require("debug")("bootprint");
var path = require("path");
var BootprintBuilder = require("../src/BootprintBuilder.js");

// CLI builder module. Generates a function that executed a preconfigured bootprint

program.version(require("./../package").version)
    .usage("[options] <spec> <jsonFile> <targetdir>")
    .description(require("./../package").description)
    .option('-f, --config-file <file>', 'Specify a config file for custom configurations')
    .option('-d, --development-mode', 'Turn on file-watcher, less source maps and http-server with live-reload')
    .option('-l, --long-stack', 'Turn on long and clarified stack-traces')
    .parse(process.argv);

if (program.args.length < 2) {
    program.help();
}

if (program["longStack"]) {
    Error.stackTraceLimit = 100;
    require("trace");
    require("clarify");
}
var configFile = program['configFile'];

var spec = program.args[0];
var jsonFile = program.args[1];
var targetDir = program.args[2];
var options = {};
if (configFile) {
    options = require(path.resolve(configFile));
}

if (program["developmentMode"]) {
    options.developmentMode = true
}

try {
    var builder = new BootprintBuilder();
    var bootprint = require("bootprint-" + spec)(builder)
        .merge(options)
        .build(jsonFile, targetDir);
} catch(e) {
    console.error(e);
    process.exit(0);
}

bootprint.generate().then(function () {
    if (options.developmentMode) {
        require("../src/developmentMode.js")(bootprint, jsonFile, targetDir);
    }
}).done(function () {
    console.log("done");
});


