var {MultiWatcher} = require('./filewatcher')
var {Server} = require('./server')
var {Bootprint} = require('../index')
var debug = require('debug')('bootprint:dev-mode')

/* eslint-disable no-console */
var stdout = console.log.bind(console)
var stderr = console.error.bind(console)
/* eslint-enable no-console */

class DevTool {
  /**
   *
   * @param {Bootprint} bootprint
   * @param {object=} options optional parameters
   * @param {string=} options.hostname the hostname to listen on (default: 127.0.0.1)
   * @param {number=} options.port the port to listen on (default: 8181)
   */
  constructor (bootprint, options) {
    this.bootprint = bootprint
    this.multiWatcher = new MultiWatcher({
      ignoreInitial: true
    })
    this.hostname = (options && options.hostname) || '127.0.0.1'
    this.port = (options && options.port) || 8181
    // Update watch paths on each bootprint run
    this.runningEventListener = ({input, targetDir, watchFiles}) => {
      if (Bootprint.kindOfInput(input) === 'file') {
        watchFiles['handlebars'] = watchFiles['handlebars'] || []
        watchFiles['handlebars'].push(input)
      }
      debug(`Updating watchFiles`, watchFiles)
      this.multiWatcher.watch(watchFiles)
    }
    this.bootprint.on('running', this.runningEventListener)
  }

  run (input, targetDir, options) {
    var startTime = Date.now()
    return this.bootprint.run(input, targetDir, options)
      .then((files) => {
        stdout(`Bootprint ran for ${Date.now() - startTime}ms. Output-files:`, files)
      })
  }

  watch (input, targetDir) {
    this.multiWatcher.on('update', (key, path) => {
      stdout(`File "${path}" changed, re-running engine "${key}"`)
      this.run(input, targetDir, {onlyEngine: key}).catch(stderr)
    })
    this.server = new Server(targetDir)
    return this.server.start(this.port)
      .then(() => stdout(`Server running on port ${this.port}`))
      // Initial invokation in order to receive a "running" event for the first time.
      // The rest will be done by the watcher
      .then(() => this.run(input, targetDir, {}))
  }

  stop () {
    return Promise.all([
      this.server.stop(),
      this.bootprint.removeListener('running', this.runningEventListener),
      this.multiWatcher.close()
    ])
  }
}

module.exports = {DevTool}
