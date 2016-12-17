
/**
 * This module is for testing unexpected errors
 * @param builder
 * @returns {*}
 */
module.exports = function (builder) {
  throw new Error('Test-Error')
}
