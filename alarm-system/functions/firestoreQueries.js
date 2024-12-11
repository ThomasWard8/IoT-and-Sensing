const admin = require("firebase-admin");
const db = admin.firestore();

async function getNightData(date) {
  const startOfNight = new Date(date);
  startOfNight.setHours(21, 0, 0, 0); // 9 PM the previous night

  const endOfNight = new Date(date);
  endOfNight.setHours(11, 0, 0, 0); // 11 AM the next morning

  const snapshot = await db
    .collection("sensordata")
    .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(startOfNight))
    .where("timestamp", "<=", admin.firestore.Timestamp.fromDate(endOfNight))
    .get();

  const data = snapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  }));

  return data;
}

async function getTargetWindow(date) {
  const startOfWindow = new Date(date);
  startOfWindow.setHours(6, 45, 0, 0); // 6:45 AM

  const endOfWindow = new Date(date);
  endOfWindow.setHours(7, 15, 0, 0); // 7:15 AM

  const snapshot = await db
    .collection("sensordata")
    .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(startOfWindow))
    .where("timestamp", "<=", admin.firestore.Timestamp.fromDate(endOfWindow))
    .get();

  const data = snapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  }));

  return data;
}

module.exports = { getNightData, getTargetWindow };
