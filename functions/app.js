const express = require('express')
const app = express()
const engines = require('consolidate')
const bodyParser = require('body-parser')
const routes = require('./routes')

// Set hbs engine
app.engine('hbs', engines.handlebars)
// Set views path
app.set('views', './views')
// Set view engine for handlebars
app.set('view engine', 'hbs')
app.set('view cache', true)

/**
 * Middlewares
 */

//Set Headers for cache control
app.use(
  express.static('public', {
    setHeaders: function(res, path, stat) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    },
  })
)

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, rest) => {
  res.redirect(308, '/docs')
})
app.get('/docs', (req, res) => {
  res.render('documentation')
})

// all of our routes will be prefixed with /api
app.use('/api', routes)

// If route not available throw 404
app.use(function(req, res, next) {
  res.status(404).json({ error: 'Resource Not Found' })
})

module.exports = app
