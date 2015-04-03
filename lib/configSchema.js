/**
 * Returns a JSON-Schema for the configuration object.
 */
module.exports = {
    definitions: {
        "stringArray": {
            type: "array",
            items: {
                type: "string"
            }
        }
    },
    properties: {
        "template": {
            description: "Path to a Handlebars-template",
            type: "string"
        },
        "partials": {
            description: "Path to a directory contains Handlebars-partials",
            type: "string"
        },
        "helpers": {
            description: "An object containing handlebars-helpers",
            additionalProperties: {
                type: "function"
            }
        },
        "less": {
            type: "object",
            properties: {
                "main": {
                    description: "A list of imported {less}-files",
                    anyOf: [
                        {type: "string"},
                        {$ref: "#/definitions/stringArray"}
                    ]
                },
                "paths": {
                    description: "A list of directories to be used as {less}-include paths",
                    anyOf: [
                        {type: "string"},
                        {$ref: "#/definitions/stringArray"}
                    ]
                }
            }
        },
        "preprocessor": {
            type: "function",
            description: "A function that returns a new JSON for the input JSON."
        }
    }
};