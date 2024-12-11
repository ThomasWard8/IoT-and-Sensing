import React, { useState, useEffect } from 'react';
import { getLastNightData } from './firestoreQueries';
import SleepBarChart from './SleepBarChart';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



function SleepStats() {
    const [heartRateData, setHeartRateData] = useState([]);
    const [restlessnessData, setRestlessnessData] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getLastNightData();

            if (data.length === 0) return;

            // Extract heart rate and accelerometer data
            const heartRates = data
                .filter((entry) => entry.heartRate)
                .map((entry) => ({
                    time: entry.timestamp.toDate(),
                    value: entry.heartRate,
                }));

            const accelerometer = data
                .filter((entry) => entry.xAccel && entry.yAccel)
                .map((entry) => ({
                    time: entry.timestamp.toDate(),
                    combined: Math.sqrt(
                        Math.pow(entry.xAccel, 2) + Math.pow(entry.yAccel, 2)
                    ),
                }));

            // Compute statistics

            const startTime = new Date(data[0].timestamp.toDate());
            const endTime = new Date(
                data[data.length - 1].timestamp.toDate()
            );

            const durationInMilliseconds = endTime - startTime;
            const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            
            const minHR = Math.min(...heartRates.map((hr) => hr.value));
            const maxHR = Math.max(...heartRates.map((hr) => hr.value));
            const avgHR =
                heartRates.reduce((acc, hr) => acc + hr.value, 0) /
                heartRates.length;

            const restlessness = accelerometer.map((entry, idx, arr) => {
                if (idx < 60) return 0; // Avoid early missing data
                const slice = arr.slice(idx - 60, idx);
                const mean = slice.reduce((acc, e) => acc + e.combined, 0) / slice.length;
                const variance =
                    slice.reduce((acc, e) => acc + Math.pow(e.combined - mean, 2), 0) /
                    slice.length;
                return Math.sqrt(variance);
            });

            setHeartRateData(heartRates);
            setRestlessnessData(restlessness);
            setStats({ minHR, maxHR, avgHR,hours, minutes });
        };

        fetchData();
    }, []);

    const heartRateChartData = {
        labels: heartRateData.map((hr) =>
            new Date(hr.time).toLocaleTimeString()
        ),
        datasets: [
            {
                label: 'Heart Rate (BPM)',
                data: heartRateData.map((hr) => hr.value),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.2,
            },
        ],
    };

    const restlessnessChartData = {
        labels: heartRateData.map((hr) =>
            new Date(hr.time).toLocaleTimeString()
        ),
        datasets: [
            {
                label: 'Restlessness (std dev)',
                data: restlessnessData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.2,
            },
        ],
    };

    return (
        <div className="sleep-stats-container">
            <h1>Sleep Stats</h1>
            {stats && (
                <div className="stats-summary">
                    <p>Minimum Heart Rate: {stats.minHR} BPM</p>
                    <p>Maximum Heart Rate: {stats.maxHR} BPM</p>
                    <p>Average Heart Rate: {stats.avgHR.toFixed(1)} BPM</p>
                    <p>Sleep Duration: {stats.hours} hours {stats.minutes} minutes</p>

                </div>
            )}
            <div className="chart-container">
                <h2>Heart Rate Over Night</h2>
                <Line data={heartRateChartData} />
            </div>
            <div className="chart-container">
                <h2>Restlessness</h2>
                <Line data={restlessnessChartData} />
            </div>

                <SleepBarChart />

        </div>
    );
}

export default SleepStats;
