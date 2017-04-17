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
var {Bootprint, CouldNotLoadInputError} = require('../')
var tmpDir = path.join(__dirname, 'tmp')
var targetDir = path.join(tmpDir, 'target')
var pify = require('pify')
var makeTree = pify(require('mkdirp'))
var removeTree = pify(require('rimraf'))
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

var defaultConfig = {
  handlebars: {
    templates: path.join(__dirname, 'fixtures', 'handlebars')
  },
  less: {
    main: require.resolve('./fixtures/main.less')
  }
}

function run (module, config, input) {
  return new Bootprint(module, config).run(input, targetDir)
}

describe('The JavaScript interface', function () {
  beforeEach(function () {
    return removeTree(tmpDir)
      .then(function () {
        return makeTree(tmpDir)
      })
  })

  it('should load a module via its name without bootprint-prefix', function () {
    return Promise.resolve()
      .then(() => run('test-module', undefined, {
        eins: 'one', zwei: 'two', drei: 'three'
      }))
      .then(() => {
        expect(fs.readdirSync(targetDir)).to.deep.equal(['index.html', 'index.xml', 'main.css', 'main.css.map'])
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
      .run(require.resolve('./fixtures/input.yaml'), targetDir)
      .then(function () {
        var content = fs.readFileSync(path.join(targetDir, 'index.html'), {encoding: 'utf-8'})
        return expect(content.trim()).to.equal('eins=ichi zwei=ni drei=san')
      })
  })

  it('should run only a single engine if onlyEngine is specified', function () {
    return Promise.resolve()
      .then(
        () => new Bootprint('test-module', undefined)
          .run({
            eins: 'one', zwei: 'two', drei: 'three'
          }, targetDir, {onlyEngine: 'handlebars'})
      )
      .then(() => {
        expect(fs.readdirSync(targetDir)).to.deep.equal(['index.html', 'index.xml'])
        expect(readResult('index.html')).to.equal('bootprint-test-module eins=one zwei=two drei=three')
        expect(readResult('index.xml')).to.equal('<body eins="one" zwei="two" drei="three"></body>')
      })
  })

  it('should emit a "running"-event"', function () {
    let event
    let bootprint = new Bootprint(a => a, {
      handlebars: {
        templates: path.join(__dirname, 'fixtures', 'handlebars')
      },
      less: {
        main: require.resolve('./fixtures/main.less')
      }
    })

    bootprint.on('running', watched => { event = watched })
    return bootprint
      .run(require.resolve('./fixtures/input.yaml'), targetDir)
      .then(function () {
        expect(event.input, 'Checking input').to.deep.equal(require.resolve('./fixtures/input.yaml'))
        expect(event.targetDir, 'Checking targetDir').to.equal(targetDir)

        var watchHbs = event.watchFiles.handlebars.map((file) => path.relative('.', file))
        expect(watchHbs, 'Checking handlebars files').to.deep.equal([
          'test/fixtures/handlebars'
        ])

        var watchLess = event.watchFiles.less.map((file) => path.relative('.', file))
        expect(watchLess, 'Checking less files').to.deep.equal([
          'test/fixtures/main.less'
        ])
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
      .to.be.rejectedWith(CouldNotLoadInputError)
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
      .to.be.rejectedWith(CouldNotLoadInputError, /404/)
      .then(() => mockInput.done())
  })

  it('should reject with a custom-execption if the input url return 403', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .reply(403, {a: 'b'})

    return expect(Bootprint.loadInput('http://example.com/swagger.json'))
      .to.be.rejectedWith(CouldNotLoadInputError, /403/)
      .then(() => mockInput.done())
  })

  it('should reject with a custom-execption if another error occurs while ', function () {
    var mockInput = nock('http://example.com')
      .get('/swagger.json')
      .replyWithError('something awful happened')

    return expect(Bootprint.loadInput('http://example.com/swagger.json'))
      .to.be.rejectedWith(CouldNotLoadInputError, 'something awful happened')
      .then(() => mockInput.done())
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
})
