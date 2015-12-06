# bootprint

> Converts json and yaml into a static html page using Handlebars and Bootstrap

![Bootprint logo](http://nknapp.github.io/bootprint/img/bootprint.svg)

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
npm install bootprint
```

## Usage

The following setup demonstrates the usage of Bootprint

<pre><code>

├── content.yaml
├── example.js
├─┬ less
│ └── main.less
├─┬ partials
│ ├── body.html.hbs
│ └── footer.html.hbs
├─┬ target
│ ├── index.html
│ ├── main.css
│ └── main.css.map
└─┬ templates
  └── index.html.hbs
</code></pre>

The following example demonstrates how to use this module:

```js
require('bootprint')
  .merge({
    handlebars: {
      templates: 'templates',
      partials: 'partials'
    },
    less: {
      main: 'less/main.less'
    }
  })
  .build('content.yaml', 'target')
  .generate()
  .done(console.log);
```

This will generate the following output

```
[ 'target/index.html', 'target/main.css', 'target/main.css.map' ]
```

    
##  API-reference

### Classes
<dl>
<dt><a href="#Customize">Customize</a></dt>
<dd><p>Bootprint uses a preconfigured <a href="https://github.com/nknapp/customize">Customize</a>-instance
that loads the modules <a href="https://github.com/nknapp/customize-engine-handlebars">customize-engine-handlebars</a>
and <a href="https://github.com/nknapp/customize-engine-less">customize-engine-less</a>.</p>
<p>Please refer to the documentation of these modules for a configuration reference.</p>
</dd>
</dl>
### Functions
<dl>
<dt><a href="#generate">generate(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Run Bootprint and write the result to the specified target directory</p>
</dd>
<dt><a href="#watch">watch()</a> ⇒ <code>EventEmitter</code></dt>
<dd><p>Run the file watcher to watch all files loaded into the
current Bootprint-configuration.
The watcher run Bootprint every time one the the input files, templates or helpers changes.</p>
</dd>
</dl>
<a name="Customize"></a>
### Customize
Bootprint uses a preconfigured [Customize](https://github.com/nknapp/customize)-instance
that loads the modules [customize-engine-handlebars](https://github.com/nknapp/customize-engine-handlebars)
and [customize-engine-less](https://github.com/nknapp/customize-engine-less).

Please refer to the documentation of these modules for a configuration reference.

**Kind**: global class  

* [Customize](#Customize)
  * [.##test()](#Customize+test)
  * [.build(jsonFile, targetDir)](#Customize+build) ⇒ <code>Object</code>

<a name="Customize+test"></a>
#### customize.##test()
test
test
testt

**Kind**: instance method of <code>[Customize](#Customize)</code>  
<a name="Customize+build"></a>
#### customize.build(jsonFile, targetDir) ⇒ <code>Object</code>
**Kind**: instance method of <code>[Customize](#Customize)</code>  

| Param | Type | Description |
| --- | --- | --- |
| jsonFile | <code>string</code> | path to the input file. |
| targetDir | <code>string</code> &#124; <code>object</code> | output directory of the index.html and main.css files |

<a name="generate"></a>
### generate(options) ⇒ <code>Promise</code>
Run Bootprint and write the result to the specified target directory

**Kind**: global function  
**Returns**: <code>Promise</code> - a promise for the completion of the build  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options passed to Customize#run() |

<a name="watch"></a>
### watch() ⇒ <code>EventEmitter</code>
Run the file watcher to watch all files loaded into the
current Bootprint-configuration.
The watcher run Bootprint every time one the the input files, templates or helpers changes.

**Kind**: global function  
**Returns**: <code>EventEmitter</code> - an EventEmitter that sends an `update`-event after each
  build, but before the files are written to disc.  



## License

`bootprint` is published under the MIT-license. 
See [LICENSE](LICENSE) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).