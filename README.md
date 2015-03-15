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
  *That is not entirely possible yet, but will be once the module is complete*

## Command line usage

`bootprint` itself does not contain any templates, so in order to use `bootprint`, you need to install a template
package (e.g. [bootprint-json-schema](http://npmjs.org/bootprint-json-schema)). So try the following.

```bash
npm install -g bootprint
npm install -g bootprint-json-schema
bootprint json-schema http://json-schema.org/schema target
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readble
form of the [Core/Validation Meta-Schema](http://json-schema.org).

## Programmatic usage

*Coming soon*

## Advanced configuration

*Coming soon*

## Writing your own template-modules

*See [bootprint-json-schema](http://github.com/nknapp/bootprint-json-schema)*

