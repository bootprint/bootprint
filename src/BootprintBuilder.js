var _ = require("lodash");
var Bootprint = require("./Bootprint.js");
var debug = require("debug")("bootprint:builder");

/**
 * This class is responsible for storing and adapting configuration options
 * for the [Bootprint](#Bootprint) object. The constructor is not
 * accessible outside the module. An instance of this class can be obtainted
 * via `require("bootprint")`. Configurations can be changed using
 * [merge({...})](#BootprintBuilder#merge) and [load(require("bootprint-module"))](#BootprintBuilder#load)
 *
 * This class is immutable. All functions return new instances rather than mutating the current instance.
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
     * Creates a new instance of BootprintBuilder. The options of the current BootprintBuilder
     * are used as default values and are overridden by the options provided as parameter.
     * @param {object} options options overriding the options of this builder
     * @return {BootprintBuilder} new Builder instance
     */
    this.merge = function (options) {
        return new BootprintBuilder(options, _options);
    };

    /**
     * Inherit configuration options from another module.
     * `require("bootprint-modulename")` usually return a function(builder)
     * and this functions needs to be passed in here.
     * A new BootprintBuilder will be returned that overrides the current options
     * with options from the builderFunction's result.
     * @param builderFunction {function} that receives a BootprintBuilder as paramater
     *  and returns a BootprintBuilder with changed configuration.
     * @return {BootprintBuilder} the result of the builderFunction
     */
    this.load = function(builderFunction) {
        return builderFunction(this);
    };

    /**
     * Build the configured Bootprint-instance.
     * @param {string} jsonFile path the a file containing the data to pass into the template
     * @param {string} targetDir path to a directory where the HTML and CSS file should be created
     * @return {Bootprint} a Bootprint-instance
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

