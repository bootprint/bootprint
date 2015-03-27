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

## Documentation

* **[Command line interface](doc/cli.md)** - How to use Bootprint from the command line.
* **[JavaScript API](doc/jsapi.md)** - How to call Bootprint from JavaScript.
* **[Configuration Options](doc/config.md)** - How to customize Bootprint for your own purposes.
* **[Developing modules](doc/modules.md)** - How to create your own modules for bootprint

## Available modules

* **[base](https://npmjs.org/package/bootprint-base)** contains a basic template
  as a base for other modules.
* **[json-schema](https://npmjs.org/package/bootprint-json-schema)** creates readble docs from
  [JSON-Schema-Definitions](http://www.json-schema.org)
* **[swagger](https://npmjs.org/package/bootprint-swagger)** creates readable docs from
  [Swagger definitions](http://swagger.io).







