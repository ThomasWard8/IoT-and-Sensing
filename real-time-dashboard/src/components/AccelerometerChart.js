import React from 'react';
import { Line } from 'react-chartjs-2'; // Ensure this import is present

import {
    Chart as ChartJS,
    TimeScale, // Import the time scale
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Import the date adapter for time-based scales
import 'chartjs-adapter-date-fns';

// Register the required Chart.js components
ChartJS.register(
    TimeScale, // Register the time scale for the x-axis
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function AccelerometerChart({ data }) {
    // Debugging: Log the received data
    // console.log('Accelerometer Data:', data);

    // Safeguard: Validate data format
    const validatedData = data.filter(
        (point) =>
            point &&
            typeof point.time === 'string' &&
            typeof point.x === 'number' &&
            typeof point.y === 'number'
    );

    // Debugging: Log the validated data
    // console.log('Validated Accelerometer Data:', validatedData);

    // Sort data by time to ensure chronological order
    const sortedData = [...data].sort(
        (a, b) => new Date(a.time) - new Date(b.time)
    );

    // Limit the data to the most recent 15 points
    const recentData = sortedData.slice(-15);

    const chartData = {
        labels: recentData.map((point) => new Date(point.time)), // Use Date objects for x-axis labels
        datasets: [
            {
                label: 'X Acceleration',
                data: recentData.map((point) => point.x),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.2,
            },
            {
                label: 'Y Acceleration',
                data: recentData.map((point) => point.y),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.2,
            },
        ],
    };

    console.log("Chart Data Points:", chartData);

    const options = {
        responsive: true,
        maintainAspectRatio: true, // Allow chart to stretch dynamically
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Real-Time Data' },
        },
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Value' } },
        },

        scales: {
            x: {
                type: 'time', // Set the x-axis to time-based
                title: {
                    display: true,
                    text: 'Time',
                },
                time: {
                    unit: 'second', // Adjust the unit as needed (e.g., second, minute)
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Acceleration (m/s²)',
                },
                suggestedMin: -2,
                suggestedMax: 2,
            },
        },
    };

    return (
        <div className="chart-container">
            <h3>Accelerometer Data</h3>
            <Line data={chartData} options={options} /> {/* Ensure Line is used here */}
        </div>
    );
}

export default AccelerometerChart;
