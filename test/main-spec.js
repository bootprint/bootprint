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
chai.use(require('chai-as-promised'))
var expect = chai.expect
var Bootprint = require('../')
var tmpDir = path.join(__dirname, 'tmp')
var targetDir = path.join(tmpDir, 'target')
var pify = require('pify')
var makeTree = pify(require('mkdirp'))
var removeTree = pify(require('rimraf'))
var nock = require('nock')

beforeEach(function () {
  return removeTree(tmpDir)
    .then(function () {
      return makeTree(tmpDir)
    })
})

/**
 * Function to sync-read files from the targetDir.
 * @function
 * @param {string} file the path of the file relative to the target directory.
 * @returns {string} the file contents as string
 */
function readResult (file) {
  return fs.readFileSync(path.join(targetDir, file), 'utf-8').trim()
}

var defaultConfig = {
  handlebars: {
    templates: path.join(__dirname, 'fixtures', 'handlebars')
  },
  less: {
    main: require.resolve('./fixtures/main.less')
  }
}

function run (module, config, input) {
  return new Bootprint(module, config).run(input, {targetDir})
}

describe('The JavaScript interface', function () {
  it('should load a module via its name without bootprint-prefix', function () {
    return Promise.resolve()
      .then(() => run('test-module', undefined, {
        eins: 'one', zwei: 'two', drei: 'three'
      }))
      .then(() => {
        expect(readResult('index.html')).to.equal('bootprint-test-module eins=one zwei=two drei=three')
        expect(readResult('index.xml')).to.equal('<body eins="one" zwei="two" drei="three"></body>')
      })
  })

  it('should load the input json each time it runs', function () {
    var swaggerJsonFile = path.join(tmpDir, 'changing.json')

    return Promise.resolve()
      .then(() => {
        fs.writeFileSync(swaggerJsonFile, JSON.stringify({
          eins: 'one', zwei: 'two', drei: 'three'
        }))
        return run(a => a, defaultConfig, swaggerJsonFile)
      })
      .then(function () {
        return expect(readResult('index.html')).to.equal('eins=one zwei=two drei=three')
      })

      // Change the file and read again. No caches may apply
      .then(() => {
        fs.writeFileSync(swaggerJsonFile, JSON.stringify({
          eins: 'un', zwei: 'deux', drei: 'trois'
        }))
        return run(a => a, defaultConfig, swaggerJsonFile)
      })
      .then(function () {
        return expect(readResult('index.html').trim()).to.equal('eins=un zwei=deux drei=trois')
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
   * @param args the command line arguments passed to the process
   * @returns {Promise}
   */
  function execBootprint ({name}, ...args) {
    return new Promise((resolve, reject) => {
      const command = 'istanbul'
      // https://github.com/gotwarlost/istanbul/issues/97
      const argv = ['cover', 'bin/bootprint.js', '--dir', `./coverage/${name}`, '--print','none', '--'].concat(args)
      cp.execFile(command, argv, {encoding: 'utf-8'}, function (err, stdout, stderr) {
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
    return execBootprint({name: 'noErrors'}, './test/fixtures/test-module.js', './test/fixtures/input.yaml', targetDir)
      .then(function (result) {
        expect(result.err).to.be.null()
        expect(outputFile('index.html'), 'Checking index.html').to.equal('eins=ichi zwei=ni drei=san')
        expect(outputFile('main.css'), 'Checking main.css')
          .to.equal('body{background-color:\'#abc\'}/*# sourceMappingURL=main.css.map */')
        expect(outputFile('main.css.map'), 'Source map main.css.map must exist').to.be.ok()
      })
  })

  it('should return with a non-zero exit-code and an error message if too few parameters are given', function () {
    return execBootprint({name: 'toFewParams'}, './test/fixtures/input.yaml ', targetDir)
      .then(function (result) {
        expect(result.err).not.to.be.null()
        expect(result.stderr, 'Checking stderr-output')
          .to.match(/Usage:*/)
        expect(result.status === 1, 'Checking exit-code')
      })
  })

  it('should return with a non-zero exit-code and without stack-trace if the source file could not be found', function () {
    return execBootprint({name: 'sourceFileNotFound'}, './test/fixtures/test-module.js', './test/fixtures/non-existing-file.yaml', targetDir)
      .then(function (result) {
        expect(result.stderr.trim(), 'Checking stderr-output')
          .to.equal('Error: ENOENT: no such file or directory, open \'./test/fixtures/non-existing-file.yaml\'')
        expect(result.stderr, 'stderr should not contain a stack-trace').not.to.match(/at /)
        expect(result.error).not.to.be.null()
      })
  })

  it('should return with a non-zero exit-code and an error with stack-trace for unexpected errors', function () {
    return execBootprint({name: 'unexpectedError'}, './test/fixtures/test-module-error.js', './test/fixtures/non-existing-file.yaml', targetDir)
      .then(function (result) {
        expect(result.stderr, 'stderr should contain a stack-trace').to.match(/throw new Error/)
        expect(result.error).not.to.be.null()
      })
  })
})

describe('the loadInputFunction', function () {
  it('should load input from files', function () {
    return expect(Bootprint.loadInput('./test/fixtures/input.yaml')).to.eventually.deep.equal({
      'drei': 'san',
      'eins': 'ichi',
      'zwei': 'ni'
    })
  })

  it('should reject with a custom execption if the input file could not be found', function () {
    return expect(Bootprint.loadInput('./test/fixtures/non-existing-input.yaml'))
      .to.be.rejectedWith(Bootprint.CouldNotLoadInputError)
  })

  it('should load input from http-urls', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .reply(200, {a: 'b'})

    return Bootprint.loadInput('http://example.com/swagger.json')
      .then(function (input) {
        expect(mockInput.isDone()).to.be.true()
        return expect(input).to.deep.equal({
          a: 'b'
        })
      })
  })

  it('should reject with a custom-execption if the input url return 404', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .reply(404, {a: 'b'})

    return expect(Bootprint.loadInput('http://example.com/swagger.json'))
      .to.be.rejectedWith(Bootprint.CouldNotLoadInputError, /404/)
      .then(() => mockInput.done())
  })

  it('should reject with a custom-execption if the input url return 403', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .reply(403, {a: 'b'})

    return expect(Bootprint.loadInput('http://example.com/swagger.json'))
      .to.be.rejectedWith(Bootprint.CouldNotLoadInputError, /403/)
      .then(() => mockInput.done())
  })

  it('should reject with a custom-execption if another error occurs while ', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .replyWithError('something awful happened')

    return expect(Bootprint.loadInput('http://example.com/swagger.json'))
      .to.be.rejectedWith(Bootprint.CouldNotLoadInputError, 'something awful happened')
      .then(() => mockInput.done())
  })
})

describe('the "loadModule"-function', function () {
  it('should load a module by prefix the name with "bootprint"', function () {
    expect(Bootprint.loadModule('test-module').package.name).to.equal('bootprint-test-module')
  })

  it('should load a module as fallback through the complete path', function () {
    expect(Bootprint.loadModule('./test/fixtures/bootprint-test-module').package.name)
      .to.equal('bootprint-test-module')
  })

  it('should throw  a module as fallback through the complete path', function () {
    expect(Bootprint.loadModule('./test/fixtures/bootprint-test-module').package.name)
      .to.equal('bootprint-test-module')
  })
})
