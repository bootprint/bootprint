/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

var path = require('path')
var fs = require('fs')
require('trace')
require('clarify')
process.on('exit', function () {
  var unhandledReasons = require('q').getUnhandledReasons()
  if (unhandledReasons.length > 0) {
    console.log(unhandledReasons)
  }
})

/* global describe */
/* global it */
// /* global before */
var expect = require('chai').expect
var bootprint = require('../')
var tmpDir = path.join(__dirname, 'tmp')
var targetDir = path.join(tmpDir, 'target')
var swaggerJsonFile = path.join(tmpDir, 'changing.json')
try {
  fs.mkdirSync(tmpDir)
} catch (e) {
  // ignored
}

function run () {
  return bootprint
    .merge({
      handlebars: {
        templates: path.join(__dirname, 'fixtures', 'handlebars')
      },
      less: {
        main: require.resolve('./fixtures/main.less')
      }
    })
    .build(swaggerJsonFile, targetDir)
    .generate()
}

describe('Bootprint ', function () {
  it('should load the input json each time it runs', function () {
    fs.writeFileSync(swaggerJsonFile, JSON.stringify({
      eins: 'one', zwei: 'two', drei: 'three'
    }))
    return run().then(function () {
      var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
      expect(content.trim()).to.equal('eins: one\nzwei: two\ndrei: three')
      fs.writeFileSync(swaggerJsonFile, JSON.stringify({
        eins: 'un', zwei: 'deux', drei: 'trois'
      }))
      return run()
    }).then(function () {
      var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
      expect(content.trim()).to.equal('eins: un\nzwei: deux\ndrei: trois')
    })
  })

  it('should accept yaml as input', function () {
    return bootprint
      .merge({
        handlebars: {
          templates: path.join(__dirname, 'fixtures', 'handlebars')
        },
        less: {
          main: require.resolve('./fixtures/main.less')
        }
      })
      .build(require.resolve('./fixtures/input.yaml'), targetDir)
      .generate()
      .then(function () {
        var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
        return expect(content.trim()).to.equal('eins: ichi\nzwei: ni\ndrei: san')
      })
  })
})
