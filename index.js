var customize = require('customize')
var Q = require('q')
var write = require('customize-write-files')
var fs = require('fs')
var posicle = require('popsicle')
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
        .catch(function (err) {
          // Augment error for identification in the cli script
          err.cause = 'bootprint-load-data'
          throw err
        })
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
  if (typeof fileOrUrlOrData !== 'string') {
    return Q(fileOrUrlOrData)
  }
  // otherwise load data from url or file
  if (fileOrUrlOrData.match(/^https?:\/\//)) {
    // Use the "request" package to download data
    return posicle.get(fileOrUrlOrData, {
      headers: {
        'User-Agent': 'Bootprint/' + require('./package').version
      }
    }).then(function (result) {
      if (result.status !== 200) {
        var error = new Error('HTTP request failed with code ' + result.status)
        error.result = result
        throw error
      }
      return yaml.safeLoad(result.data, {json: true})
    }, function (error) {
      if (error.status) {
        throw new Error(`Got ${error.status} ${error.data} when requesting ${error.url}`, 'E_HTTP')
      } else {
        throw error
      }
    })
  } else {
    return Q.nfcall(fs.readFile, fileOrUrlOrData, 'utf8').then(function (data) {
      return yaml.safeLoad(data, {json: true})
    })
  }
}
