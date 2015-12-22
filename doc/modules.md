# Writing template-modules

Node-modules like `bootprint-swagger` and `bootprint-json-schema` are called template-modules.
They provide Handlebars-templates and Less-definitions for convert a specific JSON format
to readable HTML.

Writing a template module is not much different from [writing a config-file for Bootprint](config.md). 
The main difference is, that a module can be published on npm and that it can itself be reused and
adapted.

In order to make it easy for other people to understand and contribute to a template-module, this 
document proposes a number of conventions. Eventually, there will be a documentation generator for 
modules that are based on these conventions.

## File system structure

The following structure is a proposal for the structure of a template. It is *not* required 
that a template-module have this structure, but I think a unified structure helps other people (such
as yourself in the future) find their way easier. So if you are writing a template module, you should 
structure it like this:

```
├── index.js
├── package.json
├── LICENSE
├── handlebars
│   ├── preprocessor.js
│   ├── helpers.js
│   ├── partials
│   │   ├── my-module-name
│   │   │   ├── my-partial.hbs
│   │   │   └── my-other-partial.hbs
│   │   └── inherited-module-name
│   │       ├── overridden-partial.hbs
│   │       └── other-overriden-partial.hbs
│   └── templates
│       └── index.html.hbs
└── less
    ├── include
    │   └── included-less-file.less 
    └── main.less
```

All parts except `index.js` and `package.json` are optional. All paths must be configured. 

**index.js** contains a bootprint-configuration for these folders. 
In addition to the configuration, the contents of the `package.json`-file is 
included in the export:
  
```js
var path = require('path')

// Export function to create new config (builder is passed in from outside)
module.exports = function (builder) {
  return builder
    .load(require('bootprint-inherited-module-name'))
    .merge({
      'handlebars': {
        'partials': path.join(__dirname, 'handlebars/partials'),
        'templates': require.resolve('./handlebars/templates'),
        'preprocessor': require('./handlebars/preprocessor.js'),
        'helpers': require.resolve('./handlebars/helpers.js')
      },
      'less': {
        'main': [
          require.resolve('./less/main.less')
        ],
        'paths': [
          path.join(__dirname, 'less/include')
        ]
      }
    })
}

// Add "package" metadata. This can be evaluated by documentation generators
module.exports.package = require('./package')

```


For examples, have a look at the existing template-modules (e.g. [bootprint-swagger](https://github.com/nknapp/bootprint-swagger))
and its dependencies.

## Development mode

The file watcher and the live-reload server can be started using the "-d" option of the command-line utility.
Open a browser on [http://localhost:8181](http://localhost:8181) and your current bootprint-result will be displayed. Change any 
template-file, partial, less-file, js-file containing helpers and the browser will automatically reload the page
once the bootprint-generaion is complete.

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

  * Use the `@override`-tag to mark definitions that override settings from
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

  * Add a jsdoc-like `{{!--`-comment to the beginning of the partial. Describe expected parameters and
    outputs.

  * Add a `@api public` to the comment partial that
    should be visible to other modules.

  * Add a `@readonly`-tag to the comment, if the partials should
    not be modified or overridden by another module. Bootprint does not enforce this, 
    but it is a good hint for other developers about what you are considering part of the API.

  * Use the `@override`-tag to mark definitions that override partials or templates from
    other modules.

  Example: `definitions.hbs` from `bootprint-swagger`:

```hbs
{{!--
Renders the definition-section of the HTML-page.
@param {Definition[]} definitions a list of JSON-subschemas.
@api public
@readonly
@override
--}}
```

*See [bootprint-json-schema](http://github.com/nknapp/bootprint-json-schema) for an example, although it does not follow of the above rules yet.*
*For a module extending another bootprint-module, see [bootprint-swagger](http://github.com/nknapp/bootprint-swagger).*
