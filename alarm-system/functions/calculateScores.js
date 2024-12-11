function calculateSleepScores(nightData, windowData) {
    const hrData = nightData.map((entry) => entry.heartRate);
    const accelData = nightData.map(
      (entry) => Math.sqrt(entry.xAccel ** 2 + entry.yAccel ** 2)
    );
  
    const minHR = Math.min(...hrData);
    const maxHR = Math.max(...hrData);
    const minAccel = Math.min(...accelData);
    const maxAccel = Math.max(...accelData);
  
    const chunkDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    const scores = [];
  
    let chunkStart = windowData[0].timestamp.getTime();
    let chunkEnd = chunkStart + chunkDuration;
  
    while (chunkStart < windowData[windowData.length - 1].timestamp.getTime()) {
      const chunkHR = windowData.filter(
        (entry) => entry.timestamp >= chunkStart && entry.timestamp < chunkEnd
      );
      const chunkAccel = windowData.filter(
        (entry) => entry.timestamp >= chunkStart && entry.timestamp < chunkEnd
      );
  
      if (chunkHR.length && chunkAccel.length) {
        const avgHR =
          chunkHR.reduce((sum, entry) => sum + entry.heartRate, 0) /
          chunkHR.length;
        const avgAccel =
          chunkAccel.reduce(
            (sum, entry) => sum + Math.sqrt(entry.xAccel ** 2 + entry.yAccel ** 2),
            0
          ) / chunkAccel.length;
  
        const hrScore = (avgHR - minHR) / (maxHR - minHR) * 50;
        const accelScore = (avgAccel - minAccel) / (maxAccel - minAccel) * 50;
  
        scores.push({
          timeRange: `${new Date(chunkStart).toLocaleTimeString()}`,
          totalScore: hrScore + accelScore,
        });
      }
  
      chunkStart = chunkEnd;
      chunkEnd += chunkDuration;
    }
  
    return scores;
  }
  
  module.exports = { calculateSleepScores };
  