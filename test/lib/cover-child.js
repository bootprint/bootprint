var cp = require('child_process')
var path = require('path')
var debug = require('debug')('bootprint:cover-child')

module.exports = {execFile, spawn}

/**
 * Execute a command, but never throw an error. If an error is set,
 * return it in the result, so that the tests can verify it.
 * @param coverName the name of the generated coverage report
 * @param jsFile the javascript-file
 * @param args the command line arguments passed to the process
 * @param options default: `{ engoding: 'utf-8'}`
 * @returns {Promise}
 */
function execFile (coverName, jsFile, args, options) {
  options = Object.assign({encoding: 'utf-8'}, options)
  return new Promise((resolve, reject) => {
    const {cmd, argv} = istanbulArgs(jsFile, args, coverName)
    debug('execFile $> ', cmd + ' ' + argv.map((arg) => `'${arg.replace(/'/g, '\\\'')}'`).join(' '), options)
    cp.execFile(cmd, argv, options, (err, stdout, stderr) => resolve({err, stdout, stderr}))
  })
}

function spawn (coverName, jsFile, args, options) {
  const {cmd, argv} = istanbulArgs(jsFile, args, coverName)
  debug('spawn $> ', cmd + ' ' + argv.map((arg) => `'${arg.replace(/'/g, '\\\'')}'`).join(' '), options)
  return cp.spawn(cmd, argv, options)
}

/**
 * Returns an object containing command and args for the istanbul-call
 * https://github.com/gotwarlost/istanbul/issues/97
 * @param {string} jsFile the js-file to run
 * @param {string[]} args cli-args of the child-process
 * @param {string} name name of the directory to write coverage-files to (within `coverage`)
 * @return {cmd: string, argv: string[]} parameters for `spawn` or `execFile` to run the
 *   command in istanbul
 */
function istanbulArgs (jsFile, args, name) {
  const coverageDir = path.resolve(`./coverage/${name}`)
  const cmd = path.resolve('node_modules', '.bin', 'istanbul')
  const argv = ['cover', path.resolve(jsFile), '--dir', coverageDir, '--print', 'none', '--'].concat(args)
  return {cmd, argv}
}
