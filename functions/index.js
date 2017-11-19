const app = require('./app')
const functions = require('firebase-functions')

exports.app = functions.https.onRequest(app)
