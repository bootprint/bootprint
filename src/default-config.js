var path = require("path");
var _ = require("lodash");

/**
 * This module contains the default config (less-files,template, partials, helpers)
 * for swagger-to-html. See the README for details
 * @type {{partials: {object}, template: string, helpers: function[], less: {main_files: string[], paths: string[]}}}
 */
module.exports = {
    template: null,
    helpers: require("./handlebars-helper.js"),
    less: {
        main: [
            require.resolve("bootstrap/less/bootstrap.less"),
            require.resolve("../styles/bootprint.less")
        ],
        paths: [
            path.resolve(__dirname, "..", "node_modules", "bootstrap", "less")
        ]
    },
    /**
     * A preprocessor that may return a modified json before entering the rendering process.
     * Access the inherited preprocessor is possible via <code>this.previous(json)</code>
     * @param obj the input object
     * @return a modified object
     */
    preprocessor: function(obj) { return obj; }
};

