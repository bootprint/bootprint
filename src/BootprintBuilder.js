var _ = require("lodash");
var Bootprint = require("./Bootprint.js");
var debug = require("debug")("bootprint:builder");

/**
 * This class is responsible for storing and adapting configuration options
 * for the <code>Bootprint</code> object.
 *
 * @param {object} options new options for this builder.
 * @param {object} [parentOptions] a build to inherit options from
 * @class
 */
function BootprintBuilder(options, parentOptions) {

    debug("additional options:",options);
    var _options = overrideOptions(options || {}, parentOptions);
    debug("merged options:",_options);

    // Accessible for testcases
    this._options = _options;

    /**
     * @param options {object|BootprintBuilder} options overriding the options of this builder
     * @return {BootprintBuilder} new Builder instance
     */
    this.merge = function (options) {
        return new BootprintBuilder(options, _options);
    };

    /**
     * Inherit configuration options from another module.
     * `require("bootprint-modulename")` should return a function(builder)
     * and this functions needs to be passed in here.
     * A new Builder with will be returned that overrides the current options
     * with options from the builderFunction's result.
     * @param builderFunction
     */
    this.load = function(builderFunction) {
        return builderFunction(this);
    };

    /**
     * Build the configured converter
     */
    this.build = function (jsonFile,targetDir) {
        debug("Building converter with config: %o", _options);
        return new Bootprint(jsonFile, _options, targetDir);
    };
}

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

module.exports = BootprintBuilder;

