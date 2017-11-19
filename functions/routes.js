const express = require('express') // call express
const router = express.Router() // get an instance of the express Router
const controllers = require('./controllers')

/**
 * Routes
 */

router.get('/books', controllers.books.read)
router.get('/books/:id', controllers.books.readSingle)
router.post('/books', controllers.books.create)
router.put('/books/:id', controllers.books.update)
router.delete('/books/:id', controllers.books.delete)
router.delete('/books', controllers.books.drop)

module.exports = router
