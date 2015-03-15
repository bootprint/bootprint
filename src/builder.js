var _ = require("lodash");
var Bootprint = require("./bootprint.js");
var debug = require("debug")("bootprint:builder");




// Function for overriding options as described in the Builder-JSDoc
function overrideOptions(options, parentOptions) {
    // Inherit options from parent build or use empty object if not set
    var copy = _.clone(options, true);
    if (copy.partials) {
        copy.partials = _.isArray(copy.partials) ? copy.partials : [copy.partials];
    }
    if (!parentOptions) {
        return copy;
    }
    var parentPreprocessor = parentOptions.preprocessor;
    // The preprocessor must be able to call the parent preprocessor.
    if (copy.preprocessor) {
        copy.preprocessor = copy.preprocessor.bind({
            parent: parentPreprocessor
        });
    }
    // Merge without mutating the parentOptions
    return _.merge({}, parentOptions, copy, function (a, b) {
        if (_.isArray(a)) {
            return a.concat(b);
        }
    });
}



/**
 * Builder for creating a converter with multiple overriding options-objects.
 * Values of the "options" override values of the parent configuration, if specified.
 * Array values within "options" are concatenated.
 * "options.partials" and "options.resources" are always converted to
 * objects with array-values, because they need to be overridden like arrays.
 *
 * @param options new options for this builder.
 * @param [parentOptions] {Object} a build to inherit options from
 * @constructor
 */
function Builder(options, parentOptions) {

    debug("additional options:",options);
    var _options = overrideOptions(options, parentOptions);
    debug("merged options:",_options);

    // Accessible for testcases
    this._options = _options;

    /**
     * @param options {object} options overriding the options of this builder
     * @return {Builder} new Builder instance
     */
    this.override = function (options) {
        return new Builder(options, _options);
    };

    /**
     * Build the configured converter
     */
    this.build = function (jsonFile,targetDir) {
        debug("Building converter with config: %o", _options);
        return new Bootprint(jsonFile, _options, targetDir);
    };
}

module.exports = function(options) {
    return new Builder(options);
};
