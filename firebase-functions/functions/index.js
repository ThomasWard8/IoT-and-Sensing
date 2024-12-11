const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.receiveData = functions.https.onRequest(async (req, res) => {
    try {
        // Log the received data for debugging
        console.log('Received Data:', req.body);

        // Extract data with default values for undefined fields
        const {
            heartRate = 0, 
            xAccel = 0, 
            yAccel = 0, 
            altitude = 0, 
            heading = 0, 
            xMag = 0, 
            yMag = 0, 
            zMag = 0, 
            pressure = 0, 
            temp = 0, 
            stress = 0
        } = req.body;

        if (!heartRate || !xAccel || !yAccel) {
            res.status(400).send('Missing required fields');
            return;
        }

        // Store the data in Firestore
        await db.collection('sensordata').add({
            heartRate,
            xAccel,
            yAccel,
            altitude,
            heading,
            xMag,
            yMag,
            zMag,
            pressure,
            temp,
            stress,
            timestamp: admin.firestore.FieldValue.serverTimestamp() // Add a timestamp
        });

        // Send success response
        res.status(200).send('Data received and stored successfully!');
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).send('Internal Server Error');
    }
});

