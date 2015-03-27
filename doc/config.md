# Configuration


When using Bootprint from the command line, you can provide a file with configuration options.
The configuration file is a JavaScript file of the following form:

```js
module.exports = {
    "partials": "/path/to/a/partial-directory",
    "template": "/path/To/a/template",
    "helpers": {
        "handlebarsHelper": function(value) { ... }
    },
    "less": {
        "main": [
            "path/to/a/less/file.less",
            "path/to/another/less/file.less"
        ],
        "paths": [
            "a/less/include/path"
        ]
    },
    "preprocessor": function(html) { ... }
}
```

When using Bootprint's JavaScript-API, the same format can be passed to
the [BootprintBuilder.merge()](api.md#BootprintBuilder#merge) function.

## Providing themes with custom {less}-files.

Consider the following configuration file

```js
module.exports = {
    less: {
        main: [
            "theme.less"
        ],
        paths: [
            "less-include/"
        ]
    }
}
```

This configuration will include the file "theme.less" into CSS-generation. The file is included
after other less-files. It can be used to redefine variables and style definition from other
less files. The module documentation of the bootprint-modules you are using, should include
less-variables and styles that can be overridden.

If you need to add include-paths to the less-compiler (e.g. you are including a third party library
that uses `@import` statements in their less-files, your can add their import directories
to the `paths` so that the included files can be found. This is how the `Bootstrap` less files are
included in the `bootprint-base` module.

## Overriding and adding partials

The following configuration reads Handlears-`partials` from the custom directory

```js
module.exports= TODO
```


## Providing custom helpers

TODO

Helpers are called with one more parameter than usual in Handlebars. The additional
parameter is an object `obj`:

* **obj.engine** contains the active Handlebars engine

## Preprocessor

TODO
