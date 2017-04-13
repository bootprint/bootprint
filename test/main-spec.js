/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

var path = require('path')
var fs = require('fs')
var cp = require('child_process')

var chai = require('chai')
chai.use(require('dirty-chai'))
var expect = chai.expect
var Bootprint = require('../')
var tmpDir = path.join(__dirname, 'tmp')
var targetDir = path.join(tmpDir, 'target')
var swaggerJsonFile = path.join(tmpDir, 'changing.json')
var pify = require('pify')
var makeTree = pify(require('mkdirp'))
var removeTree = pify(require('rimraf'))

beforeEach(function () {
  return removeTree(tmpDir)
    .then(function () {
      return makeTree(tmpDir)
    })
})

function run () {
  return new Bootprint(a => a, {
    handlebars: {
      templates: path.join(__dirname, 'fixtures', 'handlebars')
    },
    less: {
      main: require.resolve('./fixtures/main.less')
    }
  }).run(swaggerJsonFile,{targetDir})
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
    return new Bootprint(a => a, {
      handlebars: {
        templates: path.join(__dirname, 'fixtures', 'handlebars')
      },
      less: {
        main: require.resolve('./fixtures/main.less')
      }
    })
      .run(require.resolve('./fixtures/input.yaml'), {targetDir})
      .then(function () {
        var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
        return expect(content.trim()).to.equal('eins=ichi zwei=ni drei=san')
      })
  })
})

describe('The CLI interface', function () {
  var targetDir = path.join(tmpDir, 'cli-target')

  /**
   * Execute a command, but never throw an error. If an error is set,
   * return it in the result, so that the tests can verify it.
   * @param command
   * @returns {Promise}
   */
  function exec (command) {
    return new Promise((resolve, reject) => {
      cp.exec(command, {encoding: 'utf-8'}, function (err, stdout, stderr) {
        return resolve({
          err: err,
          stdout: stdout,
          stderr: stderr
        })
      })
    })
  }

  function outputFile (filename) {
    return fs.readFileSync(path.join(targetDir, filename), {encoding: 'utf-8'}).trim()
  }

  it('should run without errors if the correct number of parameters is provided', function () {
    return exec('./bin/bootprint.js ./test/fixtures/test-module.js ./test/fixtures/input.yaml ' + targetDir)
      .then(function (result) {
        expect(result.err).to.be.null()
        expect(outputFile('index.html'), 'Checking index.html').to.equal('eins=ichi zwei=ni drei=san')
        expect(outputFile('main.css'), 'Checking main.css')
          .to.equal('body{background-color:\'#abc\'}/*# sourceMappingURL=main.css.map */')
        expect(outputFile('main.css.map'), 'Source map main.css.map must exist').to.be.ok()
      })
  })

  it('should return with a non-zero exit-code and an error message if too few parameters are given', function () {
    return exec('./bin/bootprint.js ./test/fixtures/input.yaml ' + targetDir)
      .then(function (result) {
        expect(result.err).not.to.be.null()
        expect(result.stderr, 'Checking stderr-output')
          .to.match(/\sUsage:*/)
        expect(result.status === 1, 'Checking exit-code')
      })
  })

  it('should return with a non-zero exit-code and an error without stack-trace if the source file could not be found', function () {
    exec('./bin/bootprint.js ./test/fixtures/test-module.js  ./test/fixtures/non-existing-file.yaml ' + targetDir)
      .then(function (result) {
        expect(result.stderr, 'Checking stderr-output').to.match(/.*no such file or directory.*/)
        expect(result.stderr, 'stderr should not contain a stack-trace').not.to.match(/throw/)
        expect(result.error).not.to.be.null()
      })
  })

  it('should return with a non-zero exit-code and an error with stack-trace for unexpected errors', function () {
    exec('./bin/bootprint.js ./test/fixtures/test-module-error.js  ./test/fixtures/non-existing-file.yaml ' + targetDir)
      .then(function (result) {
        expect(result.stderr, 'stderr should contain a stack-trace').to.match(/throw new Error/)
        expect(result.error).not.to.be.null()
      })
  })
}
)
