# Release notes

<a name="current-release"></a>

# Version 2.0.1 (Thu, 13 Jul 2017 19:26:05 GMT)

* [4f3f48e](https://github.com/bootprint/bootprint/commit/4f3f48e) Fix "files"-section in "package.json" - Nils Knappmeier
* [663e3c2](https://github.com/bootprint/bootprint/commit/663e3c2) Add "engine"-property (node >=6) to package.json... - Nils Knappmeier

# Version 2.0.0 (Sun, 23 Apr 2017 14:47:57 GMT)

## Breaking changes

* **customize-engine-uglify was removed from default-engines**: [bootprint-openapi#86](https://github.com/bootprint/bootprint-openapi/issues/86) 
  revealed that the JavaScript-files generated and included by bootprint@1.0.x are basically useless.
  They were added in order to add interactive-features, but that has never been done.
  In version 2.x, the generation of JavaScript-files is removed again. It might be added in `bootprint-openapi`
  or another module, when there are feature that they are needed for.

* **Change in the JavaScript-API**: The JavaScript-API of bootprint@0.x was developed in order to be able to customize 
  input and configuration values. This functionality was then extracted into the Customize project. In bootprint@1.x
  the API was kept compatible. The new API is now totally different and designed for the needs of the command-line interface.
  As a result, if only allows one module and one configuration file.
  The use of the JavaScript-API is deprecated. If you need and this API, you can use the packages `customize`, `customize-engine-handlebars`
  and `customize-engine-less` directly. The use can (i.e. will be) found in the documentation of this package.

* **Drop support for older versions of NodeJS**: From version 2.0 on, only NodeJS 6.x and NodeJS 7.x will be supported. This 
  allows us to use new language-features like arrow functions and Promises (without using 3rd-party Promise libraries).

## Relevant commits

* [3e58da7](https://github.com/bootprint/bootprint/commit/3e58da7) Refactor dev-mode and dev-server - Nils Knappmeier
* [475308f](https://github.com/bootprint/bootprint/commit/475308f) Change targetDir-parameter to be mandatory (not in options-object) - Nils Knappmeier
* [4fe8ead](https://github.com/bootprint/bootprint/commit/4fe8ead) Change programmatic interface, remove default export - Nils Knappmeier
* [4ee635f](https://github.com/bootprint/bootprint/commit/4ee635f) Change .travis.yml-configuration - Nils Knappmeier
* [5eee441](https://github.com/bootprint/bootprint/commit/5eee441) One new test for 100% coverage... - Nils Knappmeier
* [835d53c](https://github.com/bootprint/bootprint/commit/835d53c) Added tests to increase code coverage (reporting seems to be wrong, still) - Nils Knappmeier
* [90074d6](https://github.com/bootprint/bootprint/commit/90074d6) Add tests and include sub-processes in coverage-report - Nils Knappmeier
* [649eccc](https://github.com/bootprint/bootprint/commit/649eccc) Use custom fork of "nock" with hotfix for endless loop - Nils Knappmeier
* [5959d1c](https://github.com/bootprint/bootprint/commit/5959d1c) Handle all errors from loader as CouldNotLoadInputError, fix loading bootprint-modules - Nils Knappmeier
* [bbfbc62](https://github.com/bootprint/bootprint/commit/bbfbc62) Fix handling of errors for invalid input sources - Nils Knappmeier
* [ea7d319](https://github.com/bootprint/bootprint/commit/ea7d319) BREAKING: Refactoring of the javascript-interface - Nils Knappmeier
* [56b5ada](https://github.com/bootprint/bootprint/commit/56b5ada) Remove dependency on "q" and "m-io" - Nils Knappmeier
* [7ca59e4](https://github.com/bootprint/bootprint/commit/7ca59e4) BREAKING: customize-engine-ugfliy removed - Nils Knappmeier
* [c405941](https://github.com/bootprint/bootprint/commit/c405941) BREAKING: Drop support for node<6, a lot of chore - Nils Knappmeier
* [d945423](https://github.com/bootprint/bootprint/commit/d945423) Add correct logo - Nils Knappmeier
* [0c7c42f](https://github.com/bootprint/bootprint/commit/0c7c42f) Fix broken logo in README.md - Taylor Hicks


# Version 1.0.1 (Fri, 23 Dec 2016 20:35:00 GMT)

* [824bb17](https://github.com/bootprint/bootprint/commit/824bb17) Update documentation (bootprint-swagger is deprecated) - Nils Knappmeier

# Version 1.0.0 (Fri, 23 Dec 2016 20:22:16 GMT)

* [2d465f5](https://github.com/bootprint/bootprint/commit/2d465f5) Prepare for 1.0 release - Nils Knappmeier

# Version 0.10.0 (Sun, 18 Dec 2016 14:05:39 GMT)

* [c8fe6b5](https://github.com/bootprint/bootprint/commit/c8fe6b5) Add support for including javascript-files with uglify-js - Nils Knappmeier

# Version 0.9.0 (Sat, 17 Dec 2016 21:59:21 GMT)

* [e61426b](https://github.com/bootprint/bootprint/commit/e61426b) Better error message when source file cannot be found - Nils Knappmeier
* [9d9c0f8](https://github.com/bootprint/bootprint/commit/9d9c0f8) Better error-message and tests for invalid number of cli-arguments - Nils Knappmeier
* [c273633](https://github.com/bootprint/bootprint/commit/c273633) Fix check for correct number of command-line arguments - Nils Knappmeier
* [0290846](https://github.com/bootprint/bootprint/commit/0290846) fixes YAMLException that occurs on some openapi yaml - Kit Plummer

# Version 0.8.5 (Tue, 15 Mar 2016 14:18:06 GMT)

* [5ec577c](https://github.com/bootprint/bootprint/commit/5ec577c) Bootprint logo is now at bootprint.github.io - Nils Knappmeier

# Version 0.8.4 (Tue, 15 Mar 2016 14:06:07 GMT)

* [22c9c48](https://github.com/bootprint/bootprint/commit/22c9c48) Adjust travis-configuration - Nils Knappmeier
* [16a5072](https://github.com/bootprint/bootprint/commit/16a5072) Move to bootprint-organization and enable ghook for StandardJS - Nils Knappmeier


## v0.8.3 - 2015-12-24

### Fix

* Fixed: Wrong entry for "main"-script in `package.json` (thanks to [@joaocosta](https://github.com/joaocosta))
* Don't use "trace" in test-cases since it requires Node 4
* Mention requirement of Node 4 for "-l" option in documentation

## v0.8.2 - 2015-12-22

### Fix

* Major documentation fixes.

## v0.8.0 - 2015-11-23

### Add

* #4: Support for yaml via `js-yaml`, thanks [@stephank](https://github.com/stephank)

## v0.7.8 - 2015-10-22

### Fix

* Better error messages in case of HTTP-errors.

## v0.7.7 - 2015-10-19

### Fix

* Update dependencies
* Add `files`-property to package.json
* Input of "getPromise" must JSON-parsed (Fixes loading swagger-specs via HTTP)

## v0.7.6 - 2015-10-17
### Fix

* Issue #7: ReferenceError: httpGet is not defined 
  

## v0.7.4, v0.7.5 - 2015-10-15
### Change

* Bootprint now uses `customize` and its engines. This is only an internal change
  and should not affect the API or the configuration. It allows for more flexibility 
  in the future.

## v0.7.3 - 2015-09-03
### Fixed

- When passing a plaing object as data, bootprint has thrown an exception 

## v0.7.2 - 2015-09-01
### Fixed

- Development-Mode did not start watcher on Handlebars partials

## v0.7.1 - 2015-07-20
### Fixed

- Compatibility code fixed...


## v0.7.0 - 2015-07-20
### Fixed

- Compatibility code for legaxy config format did not respect all possible variations.

## v0.6.0 - 2015-07-20
### Changed

- Template configuration should now be done with `options.handlebars.templates` pointing to a directory
  containing a `index.html.hbs` file (instead of using `options.handlebars.template` to point to a
  template file). Old behaviour still supported. Multiple template files might be supported in the future.
- Pre-processor configuration should now be done with `options.handlebars.preprocessor`

## v0.5.1 - 2015-06-22
### Fixed
- Fix to support legacy config format.
  This was broken in 0.5.0  

## v0.5.0 - 2015-06-22
### Changed

- Preferred path for handlebars options is now in `options.handlebars` (instead of `options`)
  with old configuration still supported
- Support for specifiying a target-filename in `options.handlebars.targetFile` (defaults to `index.html`)


## v0.4.12 - 2015-06-21
### Fixed

- Remove `request` from dependencies

## v0.4.11 - 2015-06-20
### Fixed

- Reduces total extracted size of bootprint by 9 MB, by replacing `request` by `get-promise`
- Display uncaught exceptions with proper stack-traces

## v0.4.10 - 2015-06-18
### Added

- Output used template-module versions

## v0.4.9 - 2015-06-17
### Fixed                          

- `Cannot read property 'bind' of undefined` occuring when running a template-module with preprocessor

## 0.4.7 (2015-04-07)

### Added 

- Handlebars helpers can be registered by a path to a JavaScript-file, instead of directly
    calling "require" with the file.
- &lt;spec> in command-line-interface can also be path to a template-module

## v0.4.6 (2015-04-07)

### Fixed

- [#1: cli.js not found when installing from npm or master](https://github.com/nknapp/bootprint/issues/1)
