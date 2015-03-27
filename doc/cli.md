# Command line usage

## tl;dr

```bash
# Install bootprint
npm install -g bootprint
# Install template module
npm install -g bootprint-swagger
# Run bootprint with the template
bootprint swagger http://petstore.swagger.io/v2/swagger.json target
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readable
form of the [Swagger-Petstore-Example](http://petstore.swagger.io/).

## The long version

The `bootprint`-module only contains the core functionality for building HTML and CSS.
In order to use `bootprint`, you need to install a template package such as `bootprint-swagger`.
Both modules must be installed globally.

You can get help by typing `bootprint --help`:

```bash
Usage: bootprint [options] <spec> <jsonFile> <targetdir>

Converts json into a static html page using Handlebars and Bootstrap

Options:

  -h, --help                output usage information
  -V, --version             output the version number
  -f, --config-file <file>  Specify a config file for custom configurations
  -d, --development-mode    Turn on file-watcher, less source maps and http-server with live-reload
  -l, --long-stack          Turn on long and clarified stack-traces
```

* The `<spec>` always consists of the name of a globally installed template-module with the `bootprint-` prefix.
This implies that all template modules must be available as `bootprint-module-name`.
* The `<jsonFile>` is a file containing the data that should be converted (e.g. the Swagger-definition or the JSON-schema).
  if the parameter starts with `http://` or `https://` the data will be loaded from the provided URL instead of a file.
* The `<target>` is a directory that will be created if necessary. The generated `index.html` and the `main.css` file will be put
 into this directory.
* `-f` or `--config-file` can be used to customize the behaviour of `bootprint`. You can change the template or parts of it
  and the styling of the output. See [the configuration reference](config.md) for details.
* `-d` or `--development-mode` is helpful if you are working on a custom style or custom partials (i.e. provided in
  the config-file. It will turn on a file-watcher that watches the template-file, all partials,
  all less-files and all less include-paths for changes. You point your browser to `http://localhost:8181`.
  The generated page will automatically reload or refresh the CSS when necessary, so you can work on your styles and
  your partials and see the result instantly. It will also generate CSS source maps, so in the Chromium Development-Tools
  you can see where your styles originate.
* `-l` or `--long-stack` is mainly a helper when changing Bootprint's core code itself. It uses the `trace` package and
  the `clarify` package to provide better call stacks for exceptions.

