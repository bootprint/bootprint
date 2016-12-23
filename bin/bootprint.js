#!/usr/bin/env node

var program = require('commander')
var path = require('path')
var debug = require('debug')('bootprint:cli')
var _package = require('../package')

program.version(_package.version)
  .usage('[options] <module> <jsonFile> <targetdir>')
  .description(_package.description)
  .option('-f, --config-file <file>', 'Specify a config file for custom configurations', loadConfig, {})
  .option('-d, --development-mode', 'Turn on file-watcher, less source maps and http-server with live-reload')
  .option('-l, --long-stack', 'Turn on long and clarified stack-traces. Requires Node 4 or newer', enableLongStack)
  .parse(process.argv)

if (program.args.length !== 3) {
  console.error('\n  Invalid number of command-line arguments. 3 arguments expected, ' +
     program.args.length + ' found: ' + JSON.stringify(program.args) + '.')
  console.error('  Please run "' + program.name() + ' --help" for a command-line reference.\n')
  process.exit(1)
}

// Options from commander
var templateModule = program.args[0]
var jsonFile = program.args[1]
var targetDir = program.args[2]
var options = program['configFile'] // Coerced by commander via fn-parameter

// Load and configure bootprint
var bootprint = require('../index.js')
  .load(requireTemplateModule(templateModule))
  .merge(options)
  .build(jsonFile, targetDir)

if (program.developmentMode) {
  bootprint.watch()
  var liveServer = require('live-server')
  var params = {
    port: 8181,
    host: '127.0.0.1',
    root: targetDir,
    noBrowser: true
  }
  liveServer.start(params)
} else {
  bootprint.generate().done(console.log, function (error) {
    if (error.cause === 'bootprint-load-data' && error.code === 'ENOENT') {
      // Provide a readable error message (without stack trace) if the source file is missing.
      console.error('\n  ' + error.message + '\n')
    } else {
      throw error
    }
  })
}

/**
 * Load the template module. Try loading "bootprint-`moduleName`" first. If it does not exist
 * treat "moduleName" as path to the module (relative to the current working dir).
 * @param moduleName {string} the name of the module to load
 * @return {function} the builder-function of the loaded module
 */
function requireTemplateModule (moduleName) {
  var templateModule = null
  try {
    templateModule = require('bootprint-' + moduleName)
    debug('loaded template-module: ', 'bootprint-' + moduleName)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      templateModule = require(path.resolve(moduleName))
      debug('loaded template-module: ', moduleName)
    } else {
      throw e
    }
  }
  debug('template-module is ', templateModule)
  return templateModule
}

/**
 * Enable long-stack-support
 */
function enableLongStack () {
  Error.stackTraceLimit = 100
  require('trace-and-clarify-if-possible')
}

/**
 * Load a the contents of a configuration file (by `require`ing it)
 * @param configFile
 * @returns {object} the configuration object
 */
function loadConfig (configFile) {
  return require(path.resolve(configFile))
}
