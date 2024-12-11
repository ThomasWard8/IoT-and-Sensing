import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getLastNightData } from './firestoreQueries'; // Ensure the correct path to your firestoreQueries.js

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SleepBarChart() {
    const [sleepScores, setSleepScores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getLastNightData();
            calculateSleepScores(data);
        }
        fetchData();
    }, []);

    function calculateSleepScores(data) {
        const hrData = data.map((entry) => ({
            time: new Date(entry.timestamp.seconds * 1000), // Convert Firestore timestamp to JavaScript Date
            value: entry.heartRate,
        }));
        const accelData = data.map((entry) => ({
            time: new Date(entry.timestamp.seconds * 1000),
            combinedAccel: Math.sqrt(entry.xAccel ** 2 + entry.yAccel ** 2),
        }));

        // Calculate global min/max values for normalization
        const globalMinHR = Math.min(...hrData.map((entry) => entry.value));
        const globalMaxHR = Math.max(...hrData.map((entry) => entry.value));
        const globalMinAccel = Math.min(...accelData.map((entry) => entry.combinedAccel));
        const globalMaxAccel = Math.max(...accelData.map((entry) => entry.combinedAccel));

        const scores = [];
        const chunkDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
        const startTime = new Date(hrData[0]?.time).setMinutes(0, 0, 0);

        let chunkStart = startTime;
        let chunkEnd = chunkStart + chunkDuration;

        console.log('Starting chunking process...');
        while (chunkStart < new Date().getTime()) {
            console.log(`Processing chunk: ${new Date(chunkStart)} - ${new Date(chunkEnd)}`);

            const chunkHR = hrData.filter(
                (entry) => entry.time >= chunkStart && entry.time < chunkEnd
            );
            const chunkAccel = accelData.filter(
                (entry) => entry.time >= chunkStart && entry.time < chunkEnd
            );

            console.log(`Chunk HR count: ${chunkHR.length}`);
            console.log(`Chunk Accelerometer count: ${chunkAccel.length}`);

            if (chunkHR.length && chunkAccel.length) {
                const avgHR = chunkHR.reduce((sum, entry) => sum + entry.value, 0) / chunkHR.length;
                console.log(`Chunk Average HR: ${avgHR}`);

                const accelSD =
                    Math.sqrt(
                        chunkAccel
                            .map((entry) => entry.combinedAccel)
                            .reduce((sum, val) => sum + (val - avgHR) ** 2, 0) /
                        chunkAccel.length
                    );
                console.log(`Chunk Accelerometer SD: ${accelSD}`);

                // Normalize using the global min and max values
                const hrScore = normalize(avgHR, globalMinHR, globalMaxHR) * 50;
                const accelScore = normalize(accelSD, globalMinAccel, globalMaxAccel) * 50;
                const totalScore = hrScore + accelScore;

                console.log(`HR Score: ${hrScore}, Accel Score: ${accelScore}, Total Score: ${totalScore}`);

                scores.push({
                    timeRange: `${new Date(chunkStart).toLocaleTimeString()}`,
                    score: totalScore,
                });
            }

            chunkStart = chunkEnd;
            chunkEnd += chunkDuration;
        }

        setSleepScores(scores);
    }

    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    const chartData = {
        labels: sleepScores.map((score) => score.timeRange),
        datasets: [
            {
                label: 'Sleep Score',
                data: sleepScores.map((score) => score.score),
                backgroundColor: sleepScores.map((score) => {
                    if (score.score < 20) return 'rgba(75, 192, 192, 0.8)'; // Deep sleep
                    if (score.score < 40) return 'rgba(54, 162, 235, 0.8)'; // Light sleep
                    if (score.score < 60) return 'rgba(255, 205, 86, 0.8)'; // REM sleep
                    if (score.score < 80) return 'rgba(255, 159, 64, 0.8)'; // Restless
                    return 'rgba(255, 99, 132, 0.8)'; // Awake
                }),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Sleep Quality Over Time' },
        },
        scales: {
            y: { max: 100, min: 0 },
        },
    };

    return (
        <div className="chart-container">
            <h2>Sleep Quality</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
}

export default SleepBarChart;
