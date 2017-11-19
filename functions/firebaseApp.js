const firebase = require('firebase-admin')
const functions = require('firebase-functions')
const firebaseApp = firebase.initializeApp(functions.config().firebase)

module.exports = firebaseApp
