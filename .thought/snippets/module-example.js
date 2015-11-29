var path = require('path')

// Export function to create new config (builder is passed in from outside)
module.exports = function (builder) {
  return builder
    .load(require('bootprint-inherited-module-name'))
    .merge({
      'handlebars': {
        'partials': path.join(__dirname, 'handlebars/partials'),
        'templates': require.resolve('./handlebars/templates'),
        'preprocessor': require('./handlebars/preprocessor.js'),
        'helpers': require.resolve('./handlebars/helpers.js')
      },
      'less': {
        'main': [
          require.resolve('./less/main.less')
        ],
        'paths': [
          path.join(__dirname, 'less/include')
        ]
      }
    })
}

// Add "package" metadata. This can be evaluated by documentation generators
module.exports.package = require('./package')
