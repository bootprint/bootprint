
## Development mode

File watcher and live-reload server can be started using the "-d" option of the command-line utility.

## Writing your own Bootprint-modules

There are already a couple of modules and all have a pretty similar structure:

Firstly, you have to define an entry point (usually **index.js**), which is
also registered as `main` in `package.json`.

The file provides a function to enhance a provided BootprintBuilder. The typical pattern is

  ```js
  module.exports = function (builder) {
      return builder
          // Load any modules that this module directly depends on
          .load(require("bootprint-base"))
          // Add custom confiration. Use `require.resolve` to ensure
          // correct paths.
          .merge({
              // Remove keys from this object, if you do not need them
              "partials": path.join(__dirname, "template/"),
              "helpers": require.resolve("./src/handlebars-helper.js"),
              "less": {
                  "main": [
                      require.resolve("./less/main.less")
                  ]
              }
          });
  };
  ```

Next, you can add overriding partials, helpers and {less}-files to the module in order to add functions or override others.

### Avoid name clashes

In order to avoid naming clashes with other modules, you should prefix all
entities of your module with the module name (without the mandatory `bootprint-`-prefix. If you module is named `bootprint-cats`, you should

* prefix all {less}-definitions with `cats--`
* put all partials into a `cats`-subdirectory of the `partials`-directory, so
  they are registered as `cats/partial-name`.
* prefix all handlebars-helpers with `cats--`.


### Defining an API

If you want your module to be reusable and you want to use [Semantic Versioning](http://semver.org)
when maintaining your module, you should define an explicit api.

Here is a convention on how to do that. Eventually, there will be support to generate an
API-documentation automatically based on this convention.

* Document your less-files with jsdoc-like tags.

  * Use the `@public`-tag to mark definitions that should be visible
    to other modules

  * Use the `@readonly`-tag to mark definitions that should not be modified
    or overridden by another module.

  * User the `@override`-tag to mark definitions that override settings from
    other modules.

  Example:
  ```css
  /**
   * Label of the `description`-section within a json-schema box.
   * @public
   */
  @json-schema--msg-section-description: "Description";

  ```

* Document your handlebars-partials by inserting a comment at the very beginning
  of the file.

  * Add a `{{!@public}}`-comment to the beginning of partials that
    should be visible to other modules.

  * Use the `{{!@readonly}}`-comment to the beinning of partials  that should
    not be modified or overridden by another module.

  Example: `before-body.hbs`

  ```hbs
  {{!@public}}{{!This partial can be overridden in order to add custom content in before the existing content}}
  ```

* Document the handlebars-helpers using jsdoc-tags. The same rules apply as before.




*See [bootprint-json-schema](http://github.com/nknapp/bootprint-json-schema) for an example, although it does not follow of the above rules yet.*
*For a module extending another bootprint-module, see [bootprint-swagger](http://github.com/nknapp/bootprint-swagger).*
