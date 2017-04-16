# Command line usage

```bash
# Install bootprint
npm install -g bootprint
# Install template module
npm install -g bootprint-openapi
# Run bootprint with the template
bootprint openapi http://petstore.swagger.io/v2/swagger.json target
```

The `bootprint`-module only contains the core functionality for building HTML and CSS.
In order to use `bootprint`, you need to install a template package such as [bootprint-openapi](https://npmjs.com/package/bootprint-openapi).
Both modules must be installed globally.

You can get help by typing `bootprint --help`:

```
Usage: bootprint [options] <module> <inputFileOrUrl> <targetDir>

  Converts json and yaml into a static html page using Handlebars and Bootstrap

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -f, --config-file <file>  Specify a config file for custom configurations
``` 

* **&lt;module>** consists of the name of a globally installed template-module optionally without the `bootprint-` prefix.
    When running `bootprint openapi ...` bootprint will first try `require('bootprint-openapi')`. If this module
    cannot be found, it will try `require('openapi')` and throw an error, if it cannot be loaded either. 
    This is a shortcut for loading npm-modules like `bootprint-openapi` or `bootprint-json-schema`. But you can also 
    load a locally checked out module using `bootprint ./template-module ...`
* **&lt;inputFileOrUrl>** is a file containing the data that should be converted (e.g. a Swagger-definition or a JSON-schema).
    if the parameter starts with `http://` or `https://` the data will be loaded from the provided URL instead of a file.
* **&lt;targetDir>** is a directory that will be created if necessary. The generated `index.html` and the `main.css` file will be put
    into this directory.
* `-f` or `--config-file` can be used to override parts of the template-module configuration and thereby customize the behaviour of 
    `bootprint`. You can override or add templates, partials, helpers, preprocessors and styles.
    See [the configuration reference](config.md) for details.

## Development tools

Bootprint 1.x used to have a `-l` and `-d` option to activate long stack-traces and file-watchers.
Those options are not available anymore. If you need them, please install the `bootprint-dev`-module instead (at the time of this writing, this module does not exist, but it will when this version of Bootprint is the default).
