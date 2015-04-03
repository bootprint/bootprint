var builder = require("../lib/bootprint-builder.js");

var jsonschema = require('jsonschema');
var extra = require('jsonschema-extra');
var schema = require("../lib/config-schema.js");

var validator = new (jsonschema.Validator)();
extra(validator);

module.exports.testEmptyConfig = function (test) {
    var result = validator.validate(
        {},
        schema);
    test.ok(result.errors.length === 0);
    test.done();
};

module.exports.testInvalidLessConfig = function (test) {
    var result = validator.validate(
        {"less": "test"},
        schema);
    test.ok(result.errors.length > 0,"Invalid config must not validate!");
    test.done();
};


module.exports.testInvalidLessConfigWithBuilder = function (test) {
    try {
        new BootprintBuilder({"less": "test"},schema);
        test.fail("Invalid config must not validate!");
    } catch (e) {
        // Invalid schema failed successfully.
    }
    test.done();
};