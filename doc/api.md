#Index

**Classes**

* [class: Bootprint](#Bootprint)
  * [new Bootprint()](#new_Bootprint)
  * [bootprint.generateHtml()](#Bootprint#generateHtml)
  * [bootprint.generateCss()](#Bootprint#generateCss)
  * [bootprint.generate()](#Bootprint#generate)
* [class: BootprintBuilder](#BootprintBuilder)
  * [new BootprintBuilder(options, [parentOptions])](#new_BootprintBuilder)
  * [bootprintBuilder.merge(options)](#BootprintBuilder#merge)
  * [bootprintBuilder.load(builderFunction)](#BootprintBuilder#load)
  * [bootprintBuilder.build(jsonFile, targetDir)](#BootprintBuilder#build)
 
<a name="Bootprint"></a>
#class: Bootprint
**Members**

* [class: Bootprint](#Bootprint)
  * [new Bootprint()](#new_Bootprint)
  * [bootprint.generateHtml()](#Bootprint#generateHtml)
  * [bootprint.generateCss()](#Bootprint#generateCss)
  * [bootprint.generate()](#Bootprint#generate)

<a name="new_Bootprint"></a>
##new Bootprint()
This class is the programmatic interface to building HTML from the json
file. A pre-configured instance of this class can be obtained from
the [BootprintBuilder](#BootprintBuilder) (i.e. via `require('bootprint')`)

<a name="Bootprint#generateHtml"></a>
##bootprint.generateHtml()
Generates html-output and store the result into the index.html-file
in the specified target directory.

**Returns**: `Promise` - a promise that resolves to the index.html-file
when all content is generated and stored.  
<a name="Bootprint#generateCss"></a>
##bootprint.generateCss()
Generates the CSS from all configured less-files.

**Returns**: `Promise` - a promise that is resolved to the target css-file when
  the CSS-compilation is finished.  
<a name="Bootprint#generate"></a>
##bootprint.generate()
Perform the complete build (i.e. `Bootprint#generateCss()`
and `Bootprint#generateHtml()`)

**Returns**: `Promise` - a promise that is resolved to an array when both tasks are complete.
The array contains the path to "index.html" at index 0 and the "main.css" at index 1.  
<a name="BootprintBuilder"></a>
#class: BootprintBuilder
**Members**

* [class: BootprintBuilder](#BootprintBuilder)
  * [new BootprintBuilder(options, [parentOptions])](#new_BootprintBuilder)
  * [bootprintBuilder.merge(options)](#BootprintBuilder#merge)
  * [bootprintBuilder.load(builderFunction)](#BootprintBuilder#load)
  * [bootprintBuilder.build(jsonFile, targetDir)](#BootprintBuilder#build)

<a name="new_BootprintBuilder"></a>
##new BootprintBuilder(options, [parentOptions])
This class is responsible for storing and adapting configuration options
for the [Bootprint](#Bootprint) object. The constructor is not
accessible outside the module. An instance of this class can be obtained
via `require("bootprint")`. Configurations can be changed using
[merge({...})](#BootprintBuilder#merge) and [load(require("bootprint-module"))](#BootprintBuilder#load)

This class is immutable. All functions return new instances rather than mutating the current instance.

**Params**

- options `object` - new options for this builder.  
- \[parentOptions\] `object` - a build to inherit options from  

<a name="BootprintBuilder#merge"></a>
##bootprintBuilder.merge(options)
Creates a new instance of BootprintBuilder. The options of the current BootprintBuilder
are used as default values and are overridden by the options provided as parameter.

**Params**

- options `object` - options overriding the options of this builder  

**Returns**: [BootprintBuilder](#BootprintBuilder) - new Builder instance  
<a name="BootprintBuilder#load"></a>
##bootprintBuilder.load(builderFunction)
Inherit configuration options from another module.
`require("bootprint-modulename")` usually return a function(builder)
and this functions needs to be passed in here.
A new BootprintBuilder will be returned that overrides the current options
with options from the builderFunction's result.

**Params**

- builderFunction `function` - that receives a BootprintBuilder as paramater
 and returns a BootprintBuilder with changed configuration.  

**Returns**: [BootprintBuilder](#BootprintBuilder) - the result of the builderFunction  
<a name="BootprintBuilder#build"></a>
##bootprintBuilder.build(jsonFile, targetDir)
Build the configured Bootprint-instance.

**Params**

- jsonFile `string` - path the a file containing the data to pass into the template,
          if the file starts with `http://` or `https://` it is assumed to be a URL and the data
          is downloaded. If the parameter is an object, it is assumed to be the data itself and
          it is used directly as input for Handlebars.
- targetDir `string` - path to a directory where the HTML and CSS file should be created  

**Returns**: [Bootprint](#Bootprint) - a Bootprint-instance  
