var {Bootprint} = require('../')

new Bootprint(a => a, {
  handlebars: {
    templates: 'templates',
    partials: 'partials'
  },
  less: {
    main: 'less/main.less'
  }
})
  .run('content.yaml', 'target')
  .then(console.log)
