var loadPartials = require("../lib/read-partials.js");
var path = require("path");
var deep = require("q-deep");

var partial = "../templates/partials";
var prefix = "abc";

module.exports.testPartials = function (test) {
    test.expect(1);
    deep(loadPartials([
            path.join(__dirname, "testPartials1"),
            path.join(__dirname, "testPartials2"),
            path.join(__dirname, "testPartialsA")
    ])).done(function (result) {
        test.deepEqual(result, {
                'eins': 'Eins',
                'zwei': 'Two',
                'drei': 'Three',
                'vier': 'Vier'
            }
        );
        test.done();
    });
};
