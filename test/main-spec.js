/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

var path = require('path')
var fs = require('fs')
var cp = require('child_process')
// require('trace')
// require('clarify')
process.on('exit', function () {
  var unhandledReasons = require('q').getUnhandledReasons()
  if (unhandledReasons.length > 0) {
    console.log(unhandledReasons)
  }
})

/* global describe */
/* global it */
/* global beforeEach */
var expect = require('chai').expect
var bootprint = require('../')
var tmpDir = path.join(__dirname, 'tmp')
var targetDir = path.join(tmpDir, 'target')
var swaggerJsonFile = path.join(tmpDir, 'changing.json')
var qfs = require('m-io/fs')

beforeEach(function () {
  return qfs.removeTree(tmpDir)
    .then(function () {
      return qfs.makeTree(tmpDir)
    })
})

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

describe('The programmatic interface', function () {
  it('should load the input json each time it runs', function () {
    fs.writeFileSync(swaggerJsonFile, JSON.stringify({
      eins: 'one', zwei: 'two', drei: 'three'
    }))

    return run()
      .then(function () {
        var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
        expect(content.trim()).to.equal('eins=one zwei=two drei=three')
        fs.writeFileSync(swaggerJsonFile, JSON.stringify({
          eins: 'un', zwei: 'deux', drei: 'trois'
        }))
        return run()
      })
      .then(function () {
        var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
        expect(content.trim()).to.equal('eins=un zwei=deux drei=trois')
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
        return expect(content.trim()).to.equal('eins=ichi zwei=ni drei=san')
      })
  })
})

describe('The CLI interface', function () {
  var targetDir = path.join(tmpDir, 'cli-target')

  function outputFile (filename) {
    return fs.readFileSync(path.join(targetDir, filename), {encoding: 'utf-8'}).trim()
  }

  it('should run without errors if the correct number of parameters is provided', function () {
    cp.spawnSync('./bin/bootprint.js ./test/fixtures/test-module.js ./test/fixtures/input.yaml ' + targetDir, {
      shell: true,
      encoding: 'utf-8'
    })
    expect(outputFile('index.html'), 'Checking index.html').to.equal('eins=ichi zwei=ni drei=san')
    expect(outputFile('main.css'), 'Checking main.css').to.equal("body{background-color:'#abc'}")
  })

  it('should return with a non-zero exit-code if too few parameters are given', function () {
    var result = cp.spawnSync('./bin/bootprint.js ./test/fixtures/input.yaml ' + targetDir, {
      shell: true,
      encoding: 'utf-8'
    })
    expect(result.stderr, 'Checking stderr-output').to.match(/\s*Invalid number of command-line arguments. 3 arguments expected.*/)
    expect(result.status === 1, 'Checking exit-code')
  })
})
