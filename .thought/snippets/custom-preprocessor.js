module.exports = {
  handlebars: {
    /**
     * @param {object} obj the input JSON object.
     * @return {object|Promise<object>} an object of the promise for an object
     **/
    preprocessor: function (obj) {
      // Call parent preprocessor
      var result = this.parent(object)
      // Do something to the result
      // Return either the result or a promise for the result.
      return result
    }
  }
}
