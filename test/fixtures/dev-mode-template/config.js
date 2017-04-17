var path = require('path')

/**
 * Configuration is loaded from a temporary directory that will
 * be setup in the "dev-tool-spec" and is not checked in to git.
 * @param {string} baseDir the base directory of the less and handlebars configuration
 */
module.exports = {
  handlebars: {
    templates: path.join(__dirname, 'handlebars', 'templates')
  },
  less: {
    main: path.join(__dirname, 'less', 'main.less')
  }
}
