/**
 * Bootprint aims to provide extendable templates and styles. The class
 * BootprintBuilder, which is esentially this file, provides this extendability.
 * The BootprintBuilder stores a configuration and provide functions to override
 * parts of it. For example, a configuration may contain certain `.less` files,
 * that used for a stylesheet. The configuration  may be overridden with by
 * providing more `.less`-files that can be used to override variable-definitions
 * in the original file.
 */

 /**
 * We use utility function from lodash in several places.
 */
var _ = require("lodash");
/**
 * Use the `debug`-module to provide debug output if needed
 */
var debug = require("debug")("bootprint:builder");
/**
 * The configuration file is defined (and validated) by a JSON-schema
 * (see [the config-schema file](./config-schema.js)) for details.
 * We use the `jsonschema` module for validation, along the the
 * `jsonschema-extra`-module, because the JSON can contain functions.
 */
var jsonschema = require('jsonschema');
var extra = require('jsonschema-extra');
var validator = new jsonschema.Validator();
extra(validator);
var path = require("path");

/**
 * The BootprintBuilder itself is a class, because it is easy this way
 * to return new instances with updated (overridden) configuration values.
 *
 * This class is immutable. All functions return new instances rather
 * than mutating the current instance.
 *
 * This class should only be instantiated via `require("bootprint")`
 * (which returns an empty instance of this class)
 * and by using the methods [merge({...})](#BootprintBuilder#merge)
 * and [load(...)](#BootprintBuilder#load) (which create a new instance
 * with overridden configuration).
 *
 * @param {object} options new options for this builder.
 * @param {object} [parentOptions] an optional base
 *      configuration that should be overridden.
 * @class
 */
function BootprintBuilder(options, parentOptions) {

    /**
     * For each new instance, we print the constructor parameters,
     * in order to trace configuration changes.
     */
    debug("parent options:", parentOptions && parentOptions._options);
    debug("additional options:", options);

    /**
     * The overriding configuration must validate against the [JSON-schema for configurations](./config-schema.html)
     * Otherwise we refuse to proceed.
     */
    var validationErrors = validator.validate(options, require("./config-schema")).errors;
    if (validationErrors.length > 0) {
        console.error("Error while validating config",options);
        console.error("Errors: ",validationErrors.map(String).join("\n"));
        throw new Error("Error while validating options-object",validationErrors);
    }

    /**
     * We do not want to modify the `options`-object, so we create a copy.
     * Some modifications are performed on the copy, because some values are provided
     * as simple values in the config, but are needed as array for the override operations.
     */
    var _options = prepareConfig(options || {});

    /**
     * If a parent config is specified, we need to use it as base for override operations.
     * The override itself is a deep merge of the base configuration with the new options.
     * The `source` of the merge is an empty object, because we do not want to alter
     * the base configuration.
     * We use a custom-overrider that handles the merger of arrays and function
     * * Arrays must be merged such that overriding values concatenated to base values.
     *   For example, if a `less`-file is provided in the configuration, it should not replace
     *   the files from the base configuration, but be added in the end, so that it can override
     *   variables from the base configuration.
     *
     * * Some function (i.e. `preprocessor` are bound to another `this`-context that contains
     *   the corresponding function from the base configuration. This is because it should be possible to call
     *   the inherited preprocessor from within the overriding preprocessor.
     */
    if (parentOptions) {
        _options = _.merge({}, parentOptions, _options, customOverrider);
    }

    /**
     * The merged options can be interesting for debugging purposes.
     */
    debug("merged options:", _options);

    /**
     * The new options are stored in an instance variable of the class
     * for testing purposes. Test cases can verify the correct merger of options.
     */
    this._options = _options;

    //TODO: Continue documentation review here
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
     * @param {function} builderFunction  that receives a BootprintBuilder as paramater
     *  and returns a BootprintBuilder with changed configuration.
     * @return {BootprintBuilder} the result of the builderFunction
     */
    this.load = function (builderFunction) {
        if (builderFunction.package) {
            console.log("Loading", builderFunction.package.name, builderFunction.package.version);
        }
        return builderFunction(this);
    };

    /**
     * Build the configured Bootprint-instance.
     * @param {string|object} jsonFile path the a file containing the data to pass into the template.
     *    if the file starts with `http://` or `https://` it is assumed to be a URL and the data
     *    is downloaded. If the parameter is an object, it is assumed to be the data itself and
     *    it is used directly as input for Handlebars.
     * @param {string} targetDir path to a directory where the HTML and CSS file should be created
     * @return {Bootprint} a Bootprint-instance
     */
    this.build = function (jsonFile, targetDir) {
        var Bootprint = require("./bootprint.js");
        debug("Building converter with config: %o", _options);
        return new Bootprint(jsonFile, _options, targetDir);
    };
}

module.exports = BootprintBuilder;


// Helper functions

// Function for overriding options as described in the Builder-JSDoc
function prepareConfig(options) {
    // Clone "options" to perform some modifications on the copy
    var copy = _.clone(options, true);
    // Backwards compatibility
    if (copy.partials || copy.template || copy.helpers || copy.preprocessor) {
        console.warn("As of bootprint 0.5.0, all handlebars configuration should be under options.handlebars.");
        copy.handlebars = {
            partials: copy.partials || copy.handlebars.partials,
            helpers: copy.helpers || copy.handlebars.helpers,
            template: copy.template || copy.handlebars.template,
            preprocessor: copy.preprocessor || copy.handlebars.preprocessor
        }
        delete copy.partials;
        delete copy.helpers;
        delete copy.template;
    }
    if (copy.handlebars) {
        if (copy.handlebars.templates && !copy.handlebars.template) {
            copy.handlebars.template = path.join(copy.handlebars.templates,"index.html.hbs");
        } else if (copy.handlebars.template) {
            console.log("In the future, instead of using 'handlebars.template' " +
                "point to a directory with 'handlebars.templates'")
        }
    }


    if (copy.handlebars) {
        coerceToArray(copy.handlebars, "partials");
        if (_.isString(copy.handlebars.helpers)) {
            copy.handlebars.helpers = require(copy.handlebars.helpers);
        }
    }
    if (copy.less) {
        coerceToArray(copy.less, "main");
        coerceToArray(copy.less, "paths");
    }

    return copy;
}


function customOverrider(a, b,propertyName) {
    if (_.isArray(a)) {
        return a.concat(b);
    }
    if (_.isFunction(a) && propertyName==="preprocessor") {
        /**
         * If no override is there, return the original
         */
        if (!b) {
            return a;
        }
        /**
         * if there is an override, execute the function in a context such that the original
         * function if accessiblea and can be called: Bind the new function to a `this`-arg
         * that contains the old function.
         */
        return b.bind({
            parent: a
        });

    }
}

/**
 * If `object[propertyName]` exists and is a non-array, it is replaced by
 * an array with the property as single object.
 * @param {object} obj the object
 * @param {string} propertyName the name of the object`s property to replace
 */
function coerceToArray(obj, propertyName) {
    if (!_.isUndefined(obj[propertyName]) && !_.isArray(obj[propertyName])) {
        obj[propertyName] = [ obj[propertyName] ];
    }
}




