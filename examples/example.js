require('../')
  .merge({
    handlebars: {
      templates: 'templates',
      partials: 'partials'
    },
    less: {
      main: 'less/main.less'
    }
  })
  .build('content.yaml', 'target')
  .generate()
  .done(console.log)
