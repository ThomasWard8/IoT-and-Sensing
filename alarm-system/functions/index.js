const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export your cloud functions
exports.checkAndTriggerAlarm = functions.https.onRequest((req, res) => {
    res.status(200).send( { trigger: false }); //debugging
  });
  