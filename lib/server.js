var connect = require('connect')
var instant = require('instant')
var http = require('http')
var {c2p} = require('./util')

class Server {
  constructor (targetDir) {
    this.app = connect()
    this.ins = instant(targetDir)
    this.app.use(this.ins)
    this.server = http.createServer(this.app)
  }

  /**
   * Run the server on a given port
   * @param {number} port the port to listen on.
   * @returns {Promise} a promise that is resolved when the server is listening on the port.
   */
  start (port) {
    return new Promise((resolve, reject) => {
      return this.server.listen(port, c2p(resolve, reject))
    })
  }

  /**
   * Stop the server
   * @returns {Promise} a promise that is resolved, when it is stopped
   */
  stop () {
    return new Promise((resolve, reject) => {
      return this.server.close(c2p(resolve, reject))
    })
  }
}

module.exports = {Server}
