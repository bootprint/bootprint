# Command line usage

```bash
# Install bootprint
npm install -g bootprint
# Install template module
npm install -g bootprint-swagger
# Run bootprint with the template
bootprint swagger http://petstore.swagger.io/v2/swagger.json target
```

The `bootprint`-module only contains the core functionality for building HTML and CSS.
In order to use `bootprint`, you need to install a template package such as [bootprint-swagger](https://npmjs.com/package/bootprint-swagger).
Both modules must be installed globally.

You can get help by typing `bootprint --help`:

```
Usage: bootprint [options] <module> <jsonFile> <targetdir>

  Converts json and yaml into a static html page using Handlebars and Bootstrap

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -f, --config-file <file>  Specify a config file for custom configurations
    -d, --development-mode    Turn on file-watcher, less source maps and http-server with live-reload
    -l, --long-stack          Turn on long and clarified stack-traces. Requires Node 4 or newer
``` 

* The **&lt;spec>** consists of the name of a globally installed template-module optionally without the `bootprint-` prefix.
    When running `bootprint swagger ...` bootprint will first try `require('bootprint-swagger')`. If this module
    cannot be found, it will try `require('swagger')` and throw an error, if it cannot be loaded either. 
    This is a shortcut for loading npm-modules like `bootprint-swagger` or `bootprint-json-schema`. But you can also 
    load a locally checked out module using `bootprint ./template-module ...`
* The **&lt;jsonFile>** is a file containing the data that should be converted (e.g. a Swagger-definition or a JSON-schema).
    if the parameter starts with `http://` or `https://` the data will be loaded from the provided URL instead of a file.
* The **&lt;target>** is a directory that will be created if necessary. The generated `index.html` and the `main.css` file will be put
    into this directory.
* `-f` or `--config-file` can be used to override parts of the template-module configuration and thereby customize the behaviour of 
    `bootprint`. You can override or add templates, partials, helpers, preprocessors and styles.
    See [the configuration reference](config.md) for details.
* `-d` or `--development-mode` is helpful if you are working on a custom style or custom partials (provided in
    the config-file. It will turn on a file-watcher that watches all relevant files. 
    Point your browser to `http://localhost:8181` to see the generated output. The page will automatically reload or refresh 
    the CSS when necessary, so you can work on your styles and your partials and see the result instantly. It will also
    generate CSS source maps, so in the Chromium Development-Tools you can see where your styles originate. 
* `-l` or `--long-stack` is mainly a helper when changing Bootprint's core code or when adding custom helpers. 
    It uses the [trace](https://npmjs.com/package/trace) package and the [clarify](https://npmjs.com/package/clarify) package to provide better call stacks for exceptions.
    Note that a version of [trace](https://npmjs.com/package/trace) is used that requires Node 4 or newer. You can't use this option 
    with lower versions.

            
