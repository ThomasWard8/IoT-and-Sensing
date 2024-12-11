import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard'; // For live data
import SleepStats from './utils/SleepStats'; // For sleep statistics
import './App.css'; // Ensure this file contains your styles

function App() {
    return (
        <Router>
            <div className="App">
                {/* Header */}
                <header className="App-header">
                    <h1>Sleep Dashboard</h1>
                </header>

                {/* Navigation Links */}
                <div className="link-container">
                    <Link to="/live-data" className="link-button">
                        Live Data
                    </Link>
                    <Link to="/sleep-stats" className="link-button">
                        Sleep Stats
                    </Link>
                </div>


                {/* Main Content */}
                <main className="App-main">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/live-data" element={<Dashboard />} />
                        <Route path="/sleep-stats" element={<SleepStats />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
