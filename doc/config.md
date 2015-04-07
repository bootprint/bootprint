# Configuration


When using Bootprint from the command line, you can provide a file with configuration options. The configuration options override the default-options of the module that you specify in the `<spec>` command-line-parameter. This means, by providing a config-file, you alter the behaviour of the `<spec>`, for example by providing alternative styles of by overriding Handlebars partials.

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
    "preprocessor": function(obj) { ... }
}
```

When using Bootprint's JavaScript-API, the same format can be passed to
the [BootprintBuilder.merge()](api.md#BootprintBuilder#merge) function.

## Providing themes with custom {less}-files.

If you want to change the styling of Bootprint's output, you can configure custom {less}-files:

```js
module.exports = {
    less: {
        main: [
            // Use "require.resolve" to ensure the correct absolute path to the directory.
            require.resolve("./theme.less")
        ],
        paths: [
            // Require.resolve does not work for directories
            require('path').join(__dirname,'less-include')
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

In the bootprint-configuration, you can provide a directory containing partials, for example: 

```js
module.exports = {
    // Use "require.resolve" to ensure the correct absolute path to the directory.
    "partials": require('path').join(__dirname,"./partials")
}

```

The template directory is traversed recursively and all `.hbs`-files are registered as partial under the name relative to the `partials`-directory and without the extension. For example, `partials/json-schema/properties.hbs` can be accessed in Handlebars by writing `{{>json-schema/properties}}`.

The module you are using already has partials and you can override them by providing a partial file with the same relative path inside *your* `partials`-directory. For example, if you are using the `bootprint-json-schema` module, you can override its partial `json-schema/properties` by adding a `partials/json-schema/properties.hbs` file to your local directory.

*You should be careful overriding partials of other modules. The author should have documented, which partials are meant to be overridden. If you override other partials anyway, you may introduce copy-code and miss bug-fixes later on.* 

*At the moment, the existing modules do not have such a documentation. I hope to add some soon.* 


## Overriding the main template

You can also replace the whole template by a custom version:

```js
module.exports = {
    "template": require.resolve("./template.hbs")
}
```
This should not be necessary. There are usually some high-level partials that can be overridden such as `base/body`, `base/footer` or `base/header` defined in `bootprint-base`.
You still might want to do it for one of the following reasons:

* You are writing a module, but you do not want to use the `bootprint-base` module. *(If the `bootprint-base` module is not flexible enough for you, you should file an issue on github instead of using your own template.)*

* You are writing a module, but you want to generate something other than HTML. *(That's a valid reason, but then the {less}-part of Bootprint is also an add-on you do not need.)* 



## Providing custom helpers

If your template or your partials require certain Handlebars-helpers, you can
provide custom helpers to the configuration:

```js
module.exports = {
    "helpers": {
        "shout-loud": function(value) {
            return value.toUpperCase();
        }
    }
}
```

Or you can set the path to a JavaScript-module exporting an object of functions

```js
// handlebars/helpers.js
module.exports = {
   "shout-loud": function(value) {
       return value.toUpperCase();
   } 
}

// configuration file
module.exports = {
    "helpers": require.resolve("./handlebars/helpers.js");
}
```

If one of your helpers already exists in the module you are using, it replaces the original helper.

Helpers are called with one more parameter than usual in Handlebars. The additional
parameter is an object containing information about the current Bootprint instance with the following keys:

```js
{
    engine: // contains the active Handlebars engine,
    config: // contains the resolved Bootprint configuration.
}
```

This object is mostly useful, if you create your own Bootprint module: 
 **engine** allows you to access engine internals (such as the registered partials ) from the helper and **config** allows you to build configurable templates.

*Note: It is planned to provide mechanisms and conventions for module-configuration, such as a helper that accesses the Bootprint-configuration in a predefined way.*

## Preprocessor

Sometimes it is easier to modify the structure of a JSON before applying the Handlebars template than to solve rendering problems within the template. 

In such a case, you can include a preprocessor-function in the configuration:

```js
module.exports = {
    /**
     * @param {object} obj the input JSON object.
     * @return {object|Promise<object>} an object of the promise for an object
     **/
    preprocessor: function(obj) {
        // Call parent preprocessor
        var result = this.parent(object);
        // Do something to the result
        // Return either the result or a promise for the result.
        return result;
    }
}
```

Inside Bootprint, the preprocessor is called in a promise-chain, so you can either return a promise or the actual result.

If you are using a module and it already has a preprocessor, you probably want to call it from somewhere in your code.
Otherwise the modules's Handlebars-template might not work anymore. The module's preprocessor
is called the `parent-preprocessor`. It is available in the function-context under `this.parent`. It is not called
automatically, so you have to call it yourself, if you want to provide your own preprocessor.

*If you write a module, you should document what input you expect and what you return, so other people know how to override
your preprocessor correctly.*







