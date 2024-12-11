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

function HeartRateChart({ data }) {
    // Debugging: Log the received data
    // console.log('Heart Rate Data:', data);

    // Safeguard: Validate data format
    const validatedData = data.filter(
        (point) => point && typeof point.time === 'string' && typeof point.value === 'number'
    );

    // Debugging: Log the validated data
    // console.log('Validated Heart Rate Data:', validatedData);

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
                label: 'Heart Rate (BPM)',
                data: recentData.map((point) => point.value),
                borderColor: 'rgb(255, 99, 132)',
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
                    text: 'Heart Rate (BPM)',
                },
                suggestedMin: 40,
                suggestedMax: 60,
            },
        },
    };

    return (
        <div className="chart-container">
            <h3>Heart Rate Over Time</h3>
            <Line data={chartData} options={options} /> {/* Ensure Line is being used here */}
        </div>
    );
}

export default HeartRateChart;
