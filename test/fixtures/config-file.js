var path = require('path')

module.exports = {
  handlebars: {
    templates: path.join(__dirname, 'handlebars')
  },
  less: {
    main: require.resolve('./main.less')
  }
}
