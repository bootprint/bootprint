var chokidar = require('chokidar')
var EventEmitter = require('events')
var sameElements = require('./same-elements')

/**
 * A file-watcher that watches file for multiple actions (i.e.
 * different keys)
 */
class MultiWatcher extends EventEmitter {
  /**
   *
   * @param {object} options options for chokidar
   */
  constructor (options) {
    super()
    this.options = options
    this.watchers = {}
  }

  /**
   *
   * @param {string} key key contained in the submitted event
   * @param {string[]} files files and directories to watch
   * @access private
   */
  watchKey (key, files) {
    if (this.watchers[key] && sameElements(this.watchers[key].files, files)) {
      // No need to change anything
      return
    }
    if (this.watchers[key]) {
      this.watchers[key].watcher.close()
    }
    if (!files) {
      return
    }
    this.watchers[key] = {
      watcher: chokidar.watch(files, this.options)
        .on('add', (path) => this.emit('update', key, path))
        .on('unlink', (path) => this.emit('update', key, path))
        .on('change', (path) => this.emit('update', key, path))
        .on('error', (error) => {
          /* istanbul ignore next */
          this.emit('error', key, error)
        })
        .on('change', ensureKeepWatch)
        .on('unlink', ensureKeepWatch),

      files: files
    }
  }

  /**
   * Watch for multiple files for different keys. Remove
   * watchers for missing keys and update all watchers for existing keys.
   * The emitted events will contain the key for each file
   * @param {object<string[]>} filesPerEngine an object containing a list of files or directory as value for each key
   */
  watch (filesPerEngine) {
    Object.keys(filesPerEngine).forEach((key) => {
      this.watchKey(key, filesPerEngine[key])
    })
    Object.keys(this.watchers).forEach((key) => {
      if (!filesPerEngine[key]) {
        this.watchers[key].watcher.close()
        delete this.watchers[key]
      }
    })
  }

  close () {
    Object.keys(this.watchers).forEach((key) => {
      this.watchers[key].watcher.close()
      delete this.watchers[key]
    })
  }
}

/**
 * Removes a watch on a file and re-adds it after 200 ms
 *
 * I have come across issues when editing files with IntelliJ products. Chokidar seems to loose
 * track of edited files if they are directly referenced (not the parent directory).
 * As a (rather hacky workaround, the watch will now be recreated after very customize-run.
 * I have not been able to reproduce this in a test-case.
 *
 * @param file
 * @param stat
 */
function ensureKeepWatch (file, stat) {
  if (!stat || stat.isFile()) {
    setTimeout(() => {
      this.unwatch(file)
      this.add(file)
    }, 10)
  }
}

module.exports = {
  MultiWatcher
}
