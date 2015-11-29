module.exports = {

  /**
   * Returns the configuration schema of the Booptrint (as formatted JSON-string)
   */
  'configuration-schema': function() {
    var config = require('../').configSchema();
    return JSON.stringify(config,null,2);
  }
}
