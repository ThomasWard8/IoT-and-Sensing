import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './Dashboard.css';
import HeartRateChart from './components/HeartRateChart';
import AccelerometerChart from './components/AccelerometerChart';
import { firebaseApp } from './firebaseConfig';

const db = getFirestore(firebaseApp);

function Dashboard() {
    const [heartRateData, setHeartRateData] = useState([]);
    const [accelerometerData, setAccelerometerData] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'sensordata'), (snapshot) => {
            const newData = snapshot.docs.map((doc) => doc.data());
            setHeartRateData(newData.map((data) => ({
                time: data.timestamp?.toDate(),
                value: data.heartRate,
            })));
            setAccelerometerData(newData.map((data) => ({
                time: data.timestamp?.toDate(),
                x: data.xAccel,
                y: data.yAccel,
            })));
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    return (
        <div className="Dashboard">
            <HeartRateChart data={heartRateData} />
            <AccelerometerChart data={accelerometerData} />
        </div>
    );
}

export default Dashboard;
