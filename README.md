## Overview

![Bootprint logo](http://nknapp.github.io/bootprint/img/bootprint.svg)

`Bootprint` is a tool for converting JSON-files into static HTML-pages using [{less}](http://lesscss.org),
[Bootstrap](http://getbootstrap.com) and [Handlebars](http://handlebarsjs.com).

It is designed with flexibility in mind:

* You can easily modify the styling by providing your own {less}-files.
* You can easily replace the Handlebars template and any register partial
* You can include custom handlebars-helpers or override existing ones.
* You can create packages with default-configurations, publish them on [npm](http://npmjs.org)
  and use them as base for further customizations.

## Command line usage

`bootprint` itself does not contain any templates, so in order to use `bootprint`, you need to install a template
package (e.g. [bootprint-json-schema](http://npmjs.org/bootprint-json-schema)). Both `bootprint` and the template package
have to be installed globally, so try the following.

```bash
npm install -g bootprint
npm install -g bootprint-json-schema
bootprint json-schema http://json-schema.org/schema target
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readble
form of the [Core/Validation Meta-Schema](http://json-schema.org).

*There seems to be a bug that sometimes causes the above example not to work (response 302). Just try it multiple time, if that's the case.
I haven't looked into it yet.*

## Programmatic usage

In order to access `bootprint` through node, you have to have the `bootprint`-module installed locally.

```bash
npm install bootprint
```

Then write you JavaScript-file.

```js
var bootprint = require("bootprint")
    .load(require("bootprint-json-schema"))
    .build("http://json-schema.org/schema","target");

bootprint.generate().done(console.log);
```

More examples can be found in the [bootprint-examples](https://github.com/nknapp/bootprint-examples) repository.

Although I haven't done that yet, it should not be too hard to include such a call in a custom Grunt-task.

### API-Reference

*TODO*


## Configuration

```js
{
 TODO
}
```


## Writing your own template-modules


*See [bootprint-json-schema](http://github.com/nknapp/bootprint-json-schema) for an example. More documentation should come soon.



