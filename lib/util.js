module.exports = {
  c2p
}

/**
 * Returns a callback that can be used to resolved node-like
 * functions to a promise, like
 *
 * ```js
 * new Promise((resolve,reject) => fs.readFile('README.txt', c2p(resolve,reject)))
 * ```
 *
 * @param {function} resolve the resolve-function of a promise
 * @param {function(Error)} reject the reject-function of a promise
 */
function c2p (resolve, reject) {
  return (err, arg) => {
    return err ? reject(err) : resolve(arg)
  }
}
