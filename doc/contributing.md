# Contributing

You can contribute by 

* Creating issues with your ideas at the corresponding github repositories.
* Creating pull-requests
* [Creating your own module](modules.md)

*Disclaimer: The shell commands below should work on Linux.
Something similar should also work on Mac and Windows, but my primary
OS is Linux. Since I want to test these commands, I will provide examples in Linux only.* 

## Development setup

In order to develop or debug anything in bootprint, you have to clone
`bootprint` and 
at least one template-module:

```bash
# Clone the bootprint module and initialize
git clone http://github.com/nknapp/bootprint.git
cd bootprint
npm install
cd ..

# Clone the template module
git clone http://github.com/nknapp/bootprint-swagger.git
cd bootprint-swagger
npm install
cd ..
```

## Developing and debugging template-modules

With the above setup, you can run Bootprint in development-mode
using the `bootprint-swagger` template-module:

```bash
# Run bootprint using the cloned repositories
# Run in development mode
cd bootprint
./bootprint-cli.js ../bootprint-swagger -d http://petstore.swagger.io/v2/swagger.json target
```

Now point your browser to `localhost:8181` and try changing
any `.hbs` or `.less` files in the `bootprint-swagger` module.
Changes should be visible instantly.

If the module, you want to change, is a good module, there is documentation for it components. Currently, the documentation of my own template modules (`bootprint-swagger`, `bootprint-json-schema` and `bootprint-base`) is very rare,
but I'm working on it.

You should also have look at [the module development guide](modules.md)
for more information about the structure of template-modules and
ways to document 

## The source code

If you want to find your way around in the bootprint core repository,
here are some points to start with (ordered by relevance).

### lib/bootprint.js

This file contains the `Bootprint`-class which invokes Handlebars
and the Less-compiler.

### lib/bootprint-builder.js

This file contains the `BootprintBuilder`-class which is used by
template-modules and the JavaScript-API to configure a Bootprint
instance. It implements the rules that apply when configuration
options are overridden in modules or config-files

### index.js

This file is the module entry-point for `require('bootprint')`.
It exports a vanilla instance of the `BootprintBuilder` (not 
configured in any way).

### bootprint-cli.js

This file registered as `bootprint` executable when Bootprint is
installed globally (via npm's `-g` option). It parses the 
command-line options and then uses the `index.js` file to 
create, configure and run Bootprint.

### lib/development-mode.js

This file is used when the development-mode is activated in the 
command-line-interface. It registers file watchers on
all configured directories and files (partials, `.less`-files, etc.)
and invokes bootprint when a file changes.



