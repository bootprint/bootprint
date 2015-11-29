module.exports = {
  handlebars: {
    helpers: {
      "shout-loud": function (value) {
        return value.toUpperCase();
      }
    }
  }
}
