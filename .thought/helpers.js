const {bootprintCustomize} = require('../')

module.exports = {

  /**
   * Returns the configuration schema of the Booptrint (as formatted JSON-string)
   */
  'configuration-schema': function () {
    var config = bootprintCustomize.configSchema()
    return JSON.stringify(config, null, 2)
  }
}
