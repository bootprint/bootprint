var customize = require('customize-watch')
var Q = require('q')
var write = require('customize-write-files')
var _ = require('lodash')
var fs = require('fs')
var httpGet = require('get-promise')
var yaml = require('js-yaml')

// preconfigured Customize instance.
module.exports = customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .registerEngine('less', require('customize-engine-less'))

// Customize type for adding methods
var Customize = customize.Customize

Customize.prototype.build = function (jsonFile, targetDir) {
  var withData = this.merge({
    handlebars: {
      data: loadFromFileOrHttp(jsonFile)
    }
  })
  return new Bootprint(withData, targetDir)
}

/**
 * The old Bootprint interface
 * @constructor
 */
function Bootprint (withData, targetDir) {
  /**
   * Run Bootprint and write the result to the specified target directory
   * @param options {object} options passed to Customize#run()
   * @returns {Promise} a promise for the completion of the build
   */
  this.generate = function generate (options) {
    return withData.run(options).then(write(targetDir))
  }

  /**
   * Run the file watcher to watch all files loaded into the
   * current Bootprint-configuration.
   * The watcher run Bootprint every time one the the input files, templates or helpers changes.
   * @returns {EventEmitter} an EventEmitter that sends an `update`-event after each
   *   build, but before the files are written to disc.
   */
  this.watch = function () {
    return withData.watch().on('update', write(targetDir))
  }
}

/**
 * Helper method for loading the bootprint-data
 * @param fileOrUrlOrData
 * @returns {*}
 * @private
 */
function loadFromFileOrHttp (fileOrUrlOrData) {
  // If this is not a string,
  // it is probably already the raw data.
  if (!_.isString(fileOrUrlOrData)) {
    return Q(fileOrUrlOrData)
  }
  // otherwise load data from url or file
  if (fileOrUrlOrData.match(/^https?:\/\//)) {
    // Use the "request" package to download data
    return httpGet(fileOrUrlOrData, {
      redirect: true,
      headers: {
        'User-Agent': 'Bootprint/' + require('./package').version
      }
    }).then(function (result) {
      if (result.status !== 200) {
        var error = new Error('HTTP request failed with code ' + result.status)
        error.result = result
        throw error
      }
      return yaml.safeLoad(result.data)
    }, function (error) {
      if (error.status) {
        throw new Error('Got ' + error.status + ' ' + error.data + ' when requesting ' + error.url, 'E_HTTP')
      } else {
        throw error
      }
    })
  } else {
    return Q.nfcall(fs.readFile, fileOrUrlOrData, 'utf8').then(function (data) {
      return yaml.safeLoad(data)
    })
  }
}
