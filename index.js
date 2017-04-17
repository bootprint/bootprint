const customize = require('customize')
const path = require('path')
const debug = require('debug')('bootpring:index')
const write = require('customize-write-files')
const pify = require('pify')
const fs = require('fs')
const readFile = pify(fs.readFile)
const yaml = require('js-yaml')
const EventEmitter = require('events')

/**
 * @access public
 */
class Bootprint extends EventEmitter {
  /**
   * Create a new Bootprint-instance
   *
   * @param {function(Customize):Customize} customizeModule a customize module (like `require('bootprint-openapi)`)
   * @param {object} config a customize-configuration to merge after loading the module
   */
  constructor (customizeModule, config) {
    super()
    this.customizeModule = customizeModule
    this.config = config
  }

  /**
   * Run the current engine with a
   * @param {object|string} input the input data (either the raw data as object, a filename as string or a url (string
   *  starting with http/https)
   * @param {string} targetDir
   * @param {object=} options
   * @param {string} options.onlyEngine only run a single customize-engine by its name (handlebars or less)
   */
  run (input, targetDir, options) {
    // Prepare customize instance for this run
    const customizeInstance = customize()
      .registerEngine('handlebars', require('customize-engine-handlebars'))
      .registerEngine('less', require('customize-engine-less'))
      .load(Bootprint.loadModule(this.customizeModule))
      .merge(this.config || {})
      .merge({
        handlebars: {
          data: Bootprint.loadInput(input)
        }
      })
    // Determine watched files and emit the event
    // and run Customize in parallel
    return Promise.all([
      customizeInstance
        .run({onlyEngine: options && options.onlyEngine})
        .then(write(targetDir)),
      customizeInstance.watched()
        .then((watchFiles) => this.emit('running', {input, targetDir, watchFiles}))
    ]).then((args) => args[0])
  }

  /**
   * Load the template module. Try loading "bootprint-`moduleName`" first. If it does not exist
   * treat "moduleName" as path to the module (relative to the current working dir).
   * @param moduleName {string} the name of the module to load
   * @return {function} the builder-function of the loaded module
   */
  static loadModule (moduleName) {
    if (typeof moduleName === 'function') {
      // This is probably already the module function
      return moduleName
    }
    var modulePath
    try {
      modulePath = require.resolve('bootprint-' + moduleName)
    } catch (e) {
      // istanbul ignore if: Not reproducible, this statement is just for safety
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
      modulePath = path.resolve(moduleName)
    }
    debug('Loading module from ', modulePath)
    return require(modulePath)
  }

  /**
   * Helper method for loading the bootprint-data
   * @param fileOrUrlOrData
   * @returns {*}
   */
  static loadInput (fileOrUrlOrData) {
    var dataAsString
    switch (Bootprint.kindOfInput(fileOrUrlOrData)) {
      case 'data':
        // Return the raw data if it is data
        return Promise.resolve(fileOrUrlOrData)
      case 'url':
        dataAsString = loadUrl(fileOrUrlOrData)
        break
      case 'file':
        dataAsString = readFile(fileOrUrlOrData, 'utf-8')
        break
    }
    return dataAsString
      .catch((error) => {
        // Throw custom error if the input file could not be loaded, because this will
        // be presented in the CLI without stack-trace
        throw new CouldNotLoadInputError(error.toString())
      })
      .then((data) => yaml.safeLoad(data, {json: true}))
  }

  /**
   * Returns 'data', 'url' or 'file' dependending on what kind of input t
   * the parameter is
   * @param fileOrUrlOrData
   */
  static kindOfInput (fileOrUrlOrData) {
    // If this is not a string,
    // it is probably already the raw data.
    if (typeof fileOrUrlOrData !== 'string') {
      return 'data'
    }
    if (fileOrUrlOrData.match(/^https?:\/\//)) {
      return 'url'
    }
    return 'file'
  }
}

/**
 * Loads data from a URL with proper user agent.
 * Returns a promise for the response content.
 * The promise is rejected of the response code indicates an error (400+)
 * @param {string} url the url to load data from
 * @access private
 */
function loadUrl (url) {
  const _package = require('./package')
  const popsicle = require('popsicle')
  return popsicle
    .get(url, {
      headers: {
        'User-Agent': `Bootprint/${_package.version}`
      }
    })
    .use(require('popsicle-status')())
    .then(response => response.body)
}

/**
 * Class for a custom error message for a non-existing input source.
 * The class is identified in the CLI-script and show without stack-trace
 */
class CouldNotLoadInputError
  extends Error {
}

module.exports = {Bootprint, CouldNotLoadInputError}
