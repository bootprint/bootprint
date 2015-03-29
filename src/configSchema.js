/**
 * Returns a JSON-Schema for the configuration object.
 */
module.exports = {
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
                   type: "array",
                   items: {
                       type: "string"
                   }
               },
                "paths": {
                    description: "A list of directories to be used as {less}-include paths",
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        },
        "preprocessor": {
            type: "function"
        }

    }
}