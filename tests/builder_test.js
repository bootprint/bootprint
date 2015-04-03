var _ = require("lodash");
var assert = require("assert");

module.exports.testBuilder = function (test) {
    test.expect(4);
    var initialValue = {"c": 3};
    var BootprintBuilder = require("../src/bootprint-builder.js");
    var builder = new BootprintBuilder(initialValue);

    builder = builder.merge({a: 1});
    test.deepEqual(_.omit(builder._options, "override"), {a: 1, c: 3});

    builder = builder.merge({a: 2, b: [1, 2, 3]});
    test.deepEqual(_.omit(builder._options, "override"), {c: 3, a: 2, b: [1, 2, 3]});

    builder = builder.merge({b: [4, 5, 6]});
    test.deepEqual(_.omit(builder._options, "override"), {c: 3, a: 2, b: [1, 2, 3, 4, 5, 6]});

    // Initial config value must not have changed
    test.deepEqual(initialValue, {c: 3});
    test.done();
};

module.exports.testExtendPartialsDef = function (test) {

    var BootprintBuilder = require("../src/bootprint-builder.js");
    var builder = new BootprintBuilder();

    builder = builder.merge({
        partials: 'aDirectory'
    });
    test.deepEqual(builder._options, {
        // Partials are expanded to arrays
        partials: ['aDirectory']
    });
    builder = builder.merge({
        partials: 'secondDirectory'
    });
    test.deepEqual(builder._options, {
        partials: ['aDirectory', 'secondDirectory']
    });
    test.done();
};

