/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

var chai = require('chai')
chai.use(require('dirty-chai'))
var expect = chai.expect
var {MultiWatcher} = require('../lib/filewatcher')

var path = require('path')
var tmpDir = path.join(__dirname, 'tmp', 'filewatcher')

var pify = require('pify')
var makeTree = pify(require('mkdirp'))
var removeTree = pify(require('rimraf'))
var write = pify(require('fs').writeFile)
var chmod = pify(require('fs').chmod)

/**
 * Create or update a file or directory
 * @param {string} file the path to a file (or a directory if the name ends on '/'
 * @param options options for fs.writeFile
 */
function add (file, options) {
  if (file[file.length - 1] === path.sep) {
    // directory
    return makeTree(file)
  }
  // file
  return makeTree(path.dirname(file)).then(() => write(file, new Date().toISOString(), options))
}

/**
 * Return the absolute path to the given file in the tmp-directory
 * @param file
 */
function tmp (file) {
  return path.join(tmpDir, file)
}

/**
 * Return the path of a file relative to the tmp-directory
 * @param file
 */
function relTmp (file) {
  return path.relative(tmpDir, file)
}

/**
 * Wait 200ms or a specified delay in order to give the watcher
 * some time to react.
 * @param {number=} delay delay in milliseconds (default: 200)
 * @returns {Promise} resolved when the delay has passed
 */
function relax (delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay || 200))
}

describe('The MultiWatcher', function () {
  /**
   * @type MultiWatcher
   */
  var multiWatcher
  var events

  beforeEach(function () {
    return Promise.resolve()
      .then(() => removeTree(tmpDir))
      .then(() => makeTree(tmpDir))
      .then(() => add(tmp('subdir1/a.txt')))
      .then(() => add(tmp('subdir1/b.txt')))
      .then(() => add(tmp('subdir2/a.txt')))
      .then(() => add(tmp('subdir2/b.txt')))
      .then(() => {
        multiWatcher = new MultiWatcher({ignoreInitial: true})
        // Collect events into the `events`-array. Make the path relative to the tmp-dir for
        // better comparing
          .on('update', (key, file, reason) => events.push({key, path: relTmp(file)}))
        events = []
      })
  })

  afterEach(() => {
    multiWatcher.close()
    return Promise.resolve()
      .then(() => chmod(tmp('subdir1'), 0o755))
      .then(() => chmod(tmp('subdir2'), 0o755))
  })

  it('should watch a list of files under a key and emit events with this key', function () {
    multiWatcher.watch({
      key1: [tmp('subdir1/a.txt'), tmp('subdir1/b.txt')],
      key2: [tmp('subdir2/a.txt'), tmp('subdir2/b.txt')]
    })

    return relax()
      .then(() => add(tmp('subdir1/a.txt')))
      .then(() => relax())
      .then(() => add(tmp('subdir2/b.txt')))
      .then(() => relax())
      .then(() => expect(events).to.deep.equal([
        {
          'key': 'key1',
          'path': 'subdir1/a.txt'
        },
        {
          'key': 'key2',
          'path': 'subdir2/b.txt'
        }
      ]))
  })

  it('should watch dirs', function () {
    multiWatcher.watch({
      key1: [tmp('subdir1')],
      key2: [tmp('subdir2')]
    })

    return relax()
      .then(() => add(tmp('subdir2/b.txt')))
      .then(() => add(tmp('subdir1/c.txt')))
      .then(() => relax())
      .then(() => removeTree(tmp('subdir2/b.txt')))
      .then(() => relax())
      .then(() => expect(events).to.deep.equal([
        {
          'key': 'key2',
          'path': 'subdir2/b.txt'
        },
        {
          'key': 'key1',
          'path': 'subdir1/c.txt'
        },
        {
          'key': 'key2',
          'path': 'subdir2/b.txt'
        }
      ]))
  })

  it('should remove watchers on files that are not specified anymore', function () {
    multiWatcher.watch({
      key1: [tmp('subdir1')],
      key2: [tmp('subdir2')]
    })

    return relax()
      .then(() => multiWatcher.watch({
        key1: [tmp('subdir1')]
      }))
      .then(() => add(tmp('subdir2/b.txt')))
      .then(() => add(tmp('subdir1/c.txt')))
      .then(() => relax())
      .then(() => removeTree(tmp('subdir2/b.txt')))
      .then(() => relax())
      .then(() => expect(events).to.deep.equal([
        {
          'key': 'key1',
          'path': 'subdir1/c.txt'
        }
      ]))
  })

  it('should change watchers for changed file-lists in a key', function () {
    multiWatcher.watch({
      key1: [tmp('subdir1')],
      key2: [tmp('subdir2')]
    })

    return relax()
      .then(() => multiWatcher.watch({
        key1: [tmp('subdir1'), tmp('subdir2')],
        key2: []
      }))
      .then(() => relax())
      .then(() => add(tmp('subdir2/b.txt')))
      .then(() => add(tmp('subdir1/c.txt')))
      .then(() => relax())
      .then(() => removeTree(tmp('subdir2/b.txt')))
      .then(() => relax())
      .then(() => expect(events).to.deep.equal([
        {
          'key': 'key1',
          'path': 'subdir2/b.txt'
        },
        {
          'key': 'key1',
          'path': 'subdir1/c.txt'
        },
        {
          'key': 'key1',
          'path': 'subdir2/b.txt'
        }
      ]))
  })

  it('should keep track of files that are removed and created again ', function () {
    return Promise.resolve()
      .then(() => multiWatcher.watch({key1: [tmp('subdir1/a.txt')]}))
      .then(() => relax())
      .then(() => removeTree(tmp('subdir1/a.txt')))
      .then(() => add(tmp('subdir1/a.txt')))
      .then(() => relax())
      .then(() => add(tmp('subdir1/a.txt')))
      .then(() => relax())
      .then(() => expect(events).to.deep.equal([
        // Only two events, because the remove and write are merged into one (chokidar "atomic"-writes)
        {
          'key': 'key1',
          'path': 'subdir1/a.txt'
        },
        {
          'key': 'key1',
          'path': 'subdir1/a.txt'
        }
      ]))
  })
})
