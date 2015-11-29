// preprocessor.js
/**
 * @param {object} obj the input JSON object.
 * @return {object|Promise<object>} an object or the promise for an object
 **/
module.exports = function (obj) {
  // Call parent preprocessor
  var result = this.parent(object);
  // Do something to the result
  // Return either the result or a promise for the result.
  return result;
}



// configuration file
module.exports = {
  handlebars: {

    preprocessor: require.resolve('./preprocessor.js')
  }
}
