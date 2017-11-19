const fetch = require('node-fetch')
const faker = require('faker')
const id = process.argv.slice(2)

const randomBook = {
  title: faker.lorem.words(),
  pubYear: '1949',
  coverPath: 'http://editorial.designtaxi.com/news-orwell14062013/1.jpg',
  author: faker.name.findName(),
  category: ['Sci-fi', 'Dystopian'],
}

fetch(`http://localhost:5001/kit-workshop/us-central1/app/api/books/${id}`, {
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'PUT',
  body: JSON.stringify(randomBook),
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.log(err))
