/**
 * This module is for testing unexpected errors that appear as rejected promise
 * @param builder
 * @returns {*}
 */
module.exports = function (builder) {
  return builder.merge({
    'handlebars': {
      preprocessor: function (data) {
        throw new Error('Test-Error')
      }
    }
  })
}
