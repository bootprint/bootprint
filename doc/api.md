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
  * [bootprintBuilder.build()](#BootprintBuilder#build)
 
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
  * [bootprintBuilder.build()](#BootprintBuilder#build)

<a name="new_BootprintBuilder"></a>
##new BootprintBuilder(options, [parentOptions])
This class is responsible for storing and adapting configuration options
for the <code>Bootprint</code> object.

**Params**

- options `object` - new options for this builder.  
- \[parentOptions\] `object` - a build to inherit options from  

<a name="BootprintBuilder#merge"></a>
##bootprintBuilder.merge(options)
**Params**

- options `object` - options overriding the options of this builder  

**Returns**: [BootprintBuilder](#BootprintBuilder) - new Builder instance  
<a name="BootprintBuilder#load"></a>
##bootprintBuilder.load(builderFunction)
Inherit configuration options from another module.
`require("bootprint-modulename")` should return a function(builder)
and this functions needs to be passed in here.
A new Builder with will be returned that overrides the current options
with options from the builderFunction's result.

**Params**

- builderFunction   

<a name="BootprintBuilder#build"></a>
##bootprintBuilder.build()
Build the configured Bootprint

**Returns**: [Bootprint](#Bootprint) - a Bootprint-instance  
