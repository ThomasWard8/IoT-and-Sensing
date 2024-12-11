const { getNightData, getTargetWindow } = require("./firestoreQueries");
const { calculateSleepScores } = require("./calculateScores");

exports.checkAndTriggerAlarm = async (req, res) => {
  try {
    const date = new Date();
    const nightData = await getNightData(date);
    const windowData = await getTargetWindow(date);

    if (!windowData.length) {
      return res.status(200).json({ message: "No data in the target window." });
    }

    const scores = calculateSleepScores(nightData, windowData);

    const threshold = 48; // Set threshold for restlessness
    const wakeUpChunk = scores.find((chunk) => chunk.totalScore > threshold);

    if (wakeUpChunk) {
      console.log(`Wake-up triggered at ${wakeUpChunk.timeRange}`);
      res.status(200).json({ wakeUp: true });
    } else {
      console.log("No restlessness detected; waking at the end of the window.");
      res.status(200).json({ wakeUp: false });
    }
  } catch (error) {
    console.error("Error in alarm function:", error);
    res.status(500).json({ error: error.message });
  }
};
