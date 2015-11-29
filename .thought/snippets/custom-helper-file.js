// handlebars/helpers.js
module.exports = {
  'shout-loud': function (value) {
    return value.toUpperCase()
  }
}

// bootprint-configuration
module.exports = {
  handlebars: {
    helpers: require.resolve('./handlebars/helpers.js')
  }
}
