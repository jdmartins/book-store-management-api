// Get firebaseApp config
const firebaseApp = require('../firebaseApp')
// Store reference to the books
const booksRef = firebaseApp.database().ref('books')

//Get lodash
const _ = require('lodash')

//Get Cache instance and turn into a promise
const cache = require('../cache')

//Not Found Object message
const notFound = {
  error: 'The requested resource was not found',
}

booksRef.on(
  'value',
  snap => cache.del('books'),
  errorObject => console.log('The read failed: ' + errorObject.code)
)

function getBooksInterval(
  books,
  { orderBy = 'title', startAt = 0, length = 6 }
) {
  const sortedBooks = orderByChild(books, orderBy)
  return sortedBooks.slice(startAt, Number(startAt) + Number(length))
}

function orderByChild(obj, keyName) {
  const newObj = Object.keys(obj).map((key, index) =>
    Object.assign({}, obj[key], { id: key })
  )
  return _.sortBy(newObj, o => o[keyName].toLowerCase(), ['asc'])
}

// Export CRUD operations on books
module.exports = {
  /**
 * @api {get} /books/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 */
  read(req, res) {
    const books = cache.get('books')
    if (books === undefined) {
      booksRef
        .once('value')
        .then(snap => {
          cache.set('books', snap.val(), (err, success) => {
            if (err) {
              console.log(err)
            }
            res.status(200).json(getBooksInterval(snap.val(), req.query))
          })
        })
        .catch(err => res.status(err.status).json(err))
    } else {
      res.status(200).json(getBooksInterval(books, req.query))
    }
  },

  // Get a book from ID
  readSingle(req, res) {
    booksRef
      .child(req.params.id)
      .once('value')
      .then(snapshot => {
        snapshot.val()
          ? res.status(200).json(snapshot.val())
          : res.status(404).json(notFound)
      })
      .catch(err => res.status(err.status).send(err))
  },

  // Add a New Book
  create(req, res) {
    if (!req.body) return res.status(400)
    const newBookRef = booksRef.push()
    const newBook = Object.assign({}, req.body, { id: newBookRef.key })
    newBookRef.set(newBook)
    res.status(201).json(newBook)
  },

  // Update a book from Id
  update(req, res) {
    const bookId = req.params.id

    // Check if book id exists
    booksRef.once('value').then(snap => {
      //if book exists
      if (snap.hasChild(bookId)) {
        const updatedBook = Object.assign({}, req.body, { id: req.params.id })
        booksRef.child(bookId).update(req.body)
      } else {
        // Return source Not Found
        res.status(404).json(notFound)
      }
    })
  },

  // Delete a book from Id
  delete(req, res) {
    const bookId = req.params.id
    // Check if book id exists
    booksRef.once('value').then(snap => {
      //if book exists
      if (snap.hasChild(bookId)) {
        // Delete Book
        booksRef.child(bookId).set({}, err => {
          if (err) {
            res.status(err.status).json(err)
          } else {
            res.status(200).json({ id: bookId })
          }
        })
      } else {
        // Return source Not Found
        res.status(404).json(notFound)
      }
    })
  },

  // Drop Book Collection
  drop(req, res) {
    booksRef.set({}, err => {
      if (err) {
        res.status(err.status).json(err)
      } else {
        res.status(200).json({ success: true })
      }
    })
  },
}
