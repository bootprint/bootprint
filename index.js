var customize = require('customize-watch')
var Q = require('q')
var write = require('customize-write-files')
var _ = require('lodash')
var path = require('path')
var httpGet = require('get-promise')

// Modify constructor: Add #build method
var Customize = customize.Customize

/**
 *
 * @param data
 * @param targetDir
 * @returns {{generate: Function}}
 */
Customize.prototype.build = function (jsonFile, targetDir) {
  var withData = this.merge({
    handlebars: {
      data: loadFromFileOrHttp(jsonFile)
    }
  })

  // Return a dummy the simulates the old bootprint-interface
  return {
    generate: function generate () {
      return withData.run().then(write(targetDir))
    },
    watch: function () {
      return withData.watch().on('update', write(targetDir))
    }
  }
}

// Pre-configure customize
module.exports = customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .registerEngine('less', require('customize-engine-less'))

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
    return httpGet(fileOrUrlOrData).then(function (result) {
      if (result.status !== 200) {
        var error = new Error('HTTP request failed with code ' + result.status)
        error.result = result
        throw error
      }
      return JSON.parse(result.data)
    })
  } else {
    return require(path.resolve(fileOrUrlOrData))
  }
}
