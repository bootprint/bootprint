# bootprint 

[![NPM version](https://badge.fury.io/js/bootprint.svg)](http://badge.fury.io/js/bootprint)
     [![Travis Build Status](https://travis-ci.org/bootprint/bootprint.svg?branch=master)](https://travis-ci.org/bootprint/bootprint)
   [![Coverage Status](https://img.shields.io/coveralls/bootprint/bootprint.svg)](https://coveralls.io/r/bootprint/bootprint)


> Converts json and yaml into a static html page using Handlebars and Bootstrap

![Bootprint logo](http://bootprint.github.io/bootprint/img/bootprint.svg)

`Bootprint` is a tool for converting JSON-files into static HTML-pages using [{less}](http://lesscss.org),
[Bootstrap](http://getbootstrap.com) and [Handlebars](http://handlebarsjs.com).

It is designed with flexibility in mind:

* You can easily modify the styling by providing your own {less}-files.
* You can easily replace the Handlebars template and any register partial
* You can include custom handlebars-helpers or override existing ones.
* You can create packages with default-configurations, publish them on [npm](http://npmjs.org)
and use them as base for further customizations.

# Installation

```
npm install -g bootprint
```

## Usage

After installing `bootprint` perform the following steps

```bash
# Install template module
npm install -g bootprint-swagger
# Run bootprint with the template
bootprint swagger http://petstore.swagger.io/v2/swagger.json target
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a [readable
form](http://petstore.swagger.io.bp.knappi.org/v2/swagger.json) of the [Swagger-Petstore-Example](http://petstore.swagger.io/).

## Further documentation Documentation

* **[Command line interface](doc/cli.md)** - How to use Bootprint from the command line.
* **[JavaScript Usage](doc/js.md)** - How to call Bootprint from JavaScript.
* **[JavaScript API-Reference](doc/api.md)** - How to call Bootprint from JavaScript.
* **[Configuration Options](doc/config.md)** - How to customize Bootprint for your own purposes.
* **[Developing modules](doc/modules.md)** - How to create your own modules for bootprint
* **[Release Notes](CHANGELOG.md)**

## Available modules

* **[base](https://npmjs.org/package/bootprint-base)** contains a basic template
as a base for other modules.
* **[json-schema](https://npmjs.org/package/bootprint-json-schema)** creates readable docs from
[JSON-Schema-Definitions](http://www.json-schema.org)
* **[swagger](https://npmjs.org/package/bootprint-swagger)** creates readable docs from
[Swagger definitions](http://swagger.io).



## License

`bootprint` is published under the MIT-license. 
See [LICENSE](LICENSE) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).