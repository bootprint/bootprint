# JavaScript API 

## Usage

```bash
npm install --save bootprint
npm install --save bootprint-swagger
```

```js
var bootprint = require('bootprint')
   .load(require('bootprint-swagger'))
   .merge({ /* Any other configuration */ })
   .build('http://petstore.swagger.io/v2/swagger.json','target')
   .generate()
   .done(console.log);
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readable
form of the [Swagger-Petstore-Example](http://petstore.swagger.io/).

## What happens in this example?

`bootprint` currently does **not** support browsers. The JavaScript API can only be accessed in 
a node-like environment. In order to do that, you need to have the `bootprint`-module 
and a template module installed locally.


* `require("bootprint")` returns an instance of the [BootprintBuilder class](api.md#BootprintBuilder).
  This class provides methods to load and override configuration options in a defined way.
  The class is designed to be immutable: Methods that modify the configuration always 
  return a new instance of `BootprintBuilder`.
* The [load function](api.md#BooprintBuilder#load) loads a template-module based on the
  current configuration. The method returns a new BootprintBuilder.
* The [merge function](api.md#BootprintBuilder#merge) overrides options from the current
  configuration with values from an explicit configuration object.
  See [the configuration reference](config.md) for details about configuration options
* The [build function](api.md#BooprintBuilder#build) function returns a preconfigured instance 
  of the [Bootprint class](api.md#Bootprint)
* The [generate function](api.md#Bootprint#generate) invokes Handlebars and LESS. 
  It returns a promise that is fulfilled when Bootprint is finished.
  
## More examples

More examples can be found in the [bootprint-examples](https://github.com/nknapp/bootprint-examples) 
repository.
  
