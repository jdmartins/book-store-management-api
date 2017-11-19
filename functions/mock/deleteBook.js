const fetch = require('node-fetch')
const id = process.argv.slice(2)

fetch(`http://localhost:5001/kit-workshop/us-central1/app/api/books/${id}`, {
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'DELETE',
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.log(err))
