/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

var path = require('path')
var fs = require('fs')

var chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
var expect = chai.expect
var {Bootprint} = require('../')
var {DevTool} = require('../lib/dev-mode')
var tmpDir = path.join(__dirname, 'tmp', 'dev-mode')
var targetDir = path.join(tmpDir, 'dev-target')

var pify = require('pify')
var makeTree = pify(require('mkdirp'))
var removeTree = pify(require('rimraf'))
var copy = require('recursive-copy')
var write = pify(require('fs').writeFile)
var request = require('popsicle')
var coverChild = require('./lib/cover-child')
var nock = require('nock')

/**
 * Function to sync-read files from the targetDir.
 * @function
 * @param {string} file the path of the file relative to the target directory.
 * @returns {string} the file contents as string
 */
function readResult (file) {
  return fs.readFileSync(path.join(targetDir, file), 'utf-8').trim()
}

function writeInput (file, contents) {
  return write(path.join(tmpDir, file), contents)
}

/**
 * Return the path of a file within the copied template
 * @param {string} file the path relative to the template root
 * @returns {string} the absolute path
 */
function tmp (file) {
  return path.join(tmpDir, file)
}

function relax (millis) {
  return new Promise((resolve, reject) => setTimeout(resolve, millis || 1000))
}
describe('The dev-mode interface', function () {
  this.timeout(5000)
  var devTool
  beforeEach(function () {
    return Promise.resolve()
      .then(() => removeTree(tmpDir))
      .then(() => makeTree(tmpDir))
      .then(() => copy('./test/fixtures/dev-mode-template', tmpDir))
  })

  afterEach(function () {
    if (devTool) {
      devTool.stop().then(() => { devTool = null })
    }
  })

  /**
   * Run the dev-tool for the test
   * @param input
   * @returns {*}
   */
  function runDevTool (input) {
    devTool = new DevTool(new Bootprint(a => a, require(`${tmpDir}/config`)))
    return devTool.watch(input, targetDir)
  }

  it('should watch for changed files', function () {
    return runDevTool(tmp('input.json'))
      .then(() => writeInput('less/main.less', `@abc: '#cde'; body { background: @abc; }`))
      .then(() => relax())
      .then(() => expect(readResult('main.css')).to.equal('body{background:\'#cde\'}/*# sourceMappingURL=main.css.map */'))
  })

  it('should watch for a changed input file', function () {
    return runDevTool(tmp('input.json'))
      .then(() => writeInput('input.json', JSON.stringify({
        'eins': 'un', 'zwei': 'deux', 'drei': 'trois'
      })))
      .then(() => relax())
      .then(() => expect(readResult('index.html')).to.equal('eins=un zwei=deux drei=trois'))
  })

  it('should start a web-server', function () {
    return runDevTool(tmp('input.json'))
      .then(() => writeInput('less/main.less', `@abc: '#cdf'; body { background: @abc; }`))
      .then(() => relax())
      .then(() => request.get('http://localhost:8181/main.css'))
      .then((response) => expect(response.body).to.equal('body{background:\'#cdf\'}/*# sourceMappingURL=main.css.map */'))
  })

  it('should not attempt to watch http-urls', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .reply(200, {'eins': 'un', 'zwei': 'deux', 'drei': 'trois'})
    return runDevTool('http://example.com/swagger.json')
      .then(() => relax())
      .then(() => {
        // If we got this far, everything is ok. The test should just not throw an error
        expect(mockInput.isDone()).to.be.true()
      })
  })
})

describe('The dev-mode cli option', function () {
  this.timeout(5000)
  var child
  beforeEach(function () {
    return Promise.resolve()
      .then(() => removeTree(tmpDir))
      .then(() => makeTree(tmpDir))
      .then(() => copy('./test/fixtures/dev-mode-template', tmpDir))
      .then(() => {
        child = coverChild.spawn(
          'dev-mode',
          'bin/bootprint.js',
          ['-d', '-f', tmp('config.js'), 'test-module', tmp('input.json'), targetDir],
          {
            encoding: 'utf-8',
            stdio: 'inherit'
          })
      })
      .then(() => relax())
  })

  afterEach(function () {
    return child.kill()
  })

  it('should watch for a changed input file', function () {
    return Promise.resolve()
      .then(() => writeInput('input.json', JSON.stringify({
        'eins': 'un', 'zwei': 'deux', 'drei': 'trois'
      })))
      .then(() => relax())
      .then(() => expect(readResult('index.html')).to.equal('eins=un zwei=deux drei=trois'))
  })
})
