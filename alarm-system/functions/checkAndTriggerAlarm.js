const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.checkAndTriggerAlarm = functions.https.onRequest(async (req, res) => {
  try {
    const alarmTime = new Date();
    alarmTime.setHours(7, 0, 0); // 7:00 AM baseline alarm time
    const startTime = new Date(alarmTime.getTime() - 15 * 60 * 1000); // 6:45 AM
    const endTime = new Date(alarmTime.getTime() + 15 * 60 * 1000); // 7:15 AM

    console.log(`Checking alarm trigger between ${startTime} and ${endTime}`);

    // Fetch last night's sleep data
    const sensorData = await db.collection('sensordata')
      .where('timestamp', '>=', startTime)
      .where('timestamp', '<=', endTime)
      .get();

    if (sensorData.empty) {
      console.error('No data found in the specified time range.');
      res.status(200).send({ message: 'No data found', trigger: false });
      return;
    }

    // Process sleep data
    const sleepData = sensorData.docs.map((doc) => doc.data());
    console.log(`Fetched ${sleepData.length} data points from Firestore.`);

    const scores = calculateScores(sleepData); // Import your existing calculateScores logic

    let trigger = false;

    // Check scores in chunks within the time window
    for (const chunk of scores) {
      console.log(`Chunk time: ${chunk.timeRange}, Score: ${chunk.score}`);
      if (chunk.score > 48) { // Threshold for waking up
        trigger = true;
        console.log(`Trigger activated at time: ${chunk.timeRange}, Score: ${chunk.score}`);
        break;
      }
    }

    // If we are past the end time, ensure the alarm is triggered
    if (new Date() >= endTime) {
      trigger = true;
      console.log(`End time reached: Alarm triggered at ${new Date()}`);
    }

    // Save the trigger state to Firestore (optional but helpful for debugging)
    await db.collection('alarmStates').doc('currentAlarm').set({ trigger });
    console.log(`Trigger state saved to Firestore: ${trigger}`);

    // Send response for Apple Shortcuts
    res.status(200).send({ trigger });
  } catch (error) {
    console.error('Error in checkAndTriggerAlarm:', error);
    res.status(500).send({ error: error.message });
  }
});
