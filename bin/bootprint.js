#!/usr/bin/env node

var program = require('commander')
var _package = require('../package')
var path = require('path')
var {Bootprint, CouldNotLoadInputError} = require('../index.js')

/* eslint-disable no-console */
var stdout = console.log.bind(console)
var stderr = console.error.bind(console)
/* eslint-enable no-console */

program.version(_package.version)
  .usage('[options] <module> <inputFileOrUrl> <targetDir>')
  .description(_package.description)
  .option(
    '-f, --config-file <file>',
    'Specify a config file for custom configurations',
    file => require(path.resolve(file)),
    {}
  )
  .parse(process.argv)

var [moduleName, input, targetDir] = program.args
if (!(moduleName && input && targetDir)) {
  stderr(program.helpInformation())
  process.exit(1)
}

new Bootprint(moduleName, program['configFile'])
  .run(input, targetDir)
  .then(
    stdout,
    (error) => {
      if (error instanceof CouldNotLoadInputError) {
        stderr(error.message)
      } else {
        stderr(error)
      }
    }
  )
