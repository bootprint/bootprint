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
  .option('-d, --development-mode',
    'Turn on file-watcher, less source-maps and http-server with live-reload'
  )
  .parse(process.argv)

var [moduleName, input, targetDir] = program.args
if (!(moduleName && input && targetDir)) {
  stderr(program.helpInformation())
  process.exit(1)
}

var bootprint = new Bootprint(moduleName, program['configFile'])
if (program['developmentMode']) {
  require('trace-and-clarify-if-possible')
  var {DevTool} = require('../lib/dev-mode')
  var devTool = new DevTool(bootprint, {hostname: '127.0.0.1', port: 8181})
  devTool.watch(input, targetDir)

  process.on('SIGTERM', () => {
    devTool.stop()
  })
} else {
  bootprint.run(input, targetDir)
    .then(
      (output) => stdout(output),
      (error) => {
        if (error instanceof CouldNotLoadInputError) {
          stderr(error.message)
        } else {
          stderr(error)
        }
      }
    )
}
