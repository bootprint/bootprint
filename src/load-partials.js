// This module resolves partial definition from the configuration
// an mapping "partial-name" -> "partial-contents"
// See "../tests/partials_test.js" for details

var qfs = require("q-io/fs");
var path = require("path");
var deep = require("q-deep");
var _ = require("lodash");
var debug = require("debug")("bootprint:partials");
var Q = require("q");


/**
 * Read the files in a directory tree and return the relativ paths based on the directory
 * @param dir
 * @returns {Object} an object containing the partial name as key and the file-path as value
 */
function filesInTree(dir) {
    return qfs.listTree(dir, function (file, stat) {
        return stat.isFile() && path.extname(file) === ".hbs";
    }).invoke("map", function (file) {
        return {
            name:  path.relative(dir, file).replace(/\.hbs$/, "").replace(/\\/g, "/"),
            value: file
        };
    });
}


/**
 * Returns a merged object partial-name -> partial-file for a list of partial directories.
 * Partials that appear in a directory later in the list overried previous ones.
 * @param partialDirs
 * @returns {*}
 */
function partialFiles(partialDirs) {
    debug("partialfiles", partialDirs);
    return partialDirs.reduce(function (subResult, current) {
        // Partials as { name: value, ...} object
        var partials = filesInTree(current).then(function (nameToFile) {
            return _(nameToFile).indexBy("name").mapValues(_.property("value")).value();
        });
        return deep([subResult, partials]).then(function (args) {
            debug("Partial result ", args);
            return _.merge(args[0], args[1]);
        });
    }, Q({}));
}

/**
 * Read the contents of partials from multiple specified directories
 * @param partialDirs
 * @returns {*}
 */
function readPartials(partialDirs) {
    debug("readPartials: ",partialDirs);
    return partialFiles(partialDirs).then(function (partialFiles) {
        return deep(_.mapValues(partialFiles, function (file) {
            debug("reading ",file);
            return qfs.read(file);
        }));
    });
}



module.exports = readPartials;