var Handlebars = require('handlebars')
var qfs = require('q-io/fs')
var Q = require('q')
var path = require('path')
var less = require('less')
var _ = require('lodash')
var debug = require('debug')('bootprint:core')
var loadPartials = require('./read-partials.js')
var http = require('http')
var httpGet = require('get-promise')





/**
 * This class is the programmatic interface to building HTML from the json
 * file. A pre-configured instance of this class can be obtained from
 * the [BootprintBuilder](#BootprintBuilder) (i.e. via `require('bootprint')`)
 * @class
 * @see BootprintBuilder
 */
function Bootprint (jsonFile, customize, targetDir) {




  debug('Creating Bootprint', jsonFile, options, targetDir)
  // Visible field with actual options needed by developmentMode
  this.options = options

  /**
   * Perform the complete build (i.e. {@link Bootprint#generateCss()}
   * and {@link Bootprint#generateHtml()})
   * @returns {Promise} a promise that is resolved to an array when both tasks are complete.
   * The array contains the path to "index.html" at index 0 and the "main.css" at index 1.
   */
  this.generate = function () {
    debug('Generating HTML and CSS')
    return Q.all([this.generateHtml(), this.generateCss()])
  }
}

module.exports = Bootprint
