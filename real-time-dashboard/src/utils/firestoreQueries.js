import { db } from '../firebaseConfig'; // Ensure this path is correct
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

// Helper function to calculate 9 PM the previous day and 11 AM today
const getLastNightRange = () => {
    const now = new Date();

    // Calculate 9 PM yesterday
    const ninePM = new Date();
    ninePM.setDate(now.getDate() - 1); // Always go to the previous day
    ninePM.setHours(21, 0, 0, 0); // Set to 9 PM

    // Calculate 11 AM today
    const elevenAM = new Date();
    elevenAM.setHours(11, 0, 0, 0); // Set to 11 AM

    return {
        start: Timestamp.fromDate(ninePM),
        end: Timestamp.fromDate(elevenAM),
    };
};

// Fetch data between 9 PM the previous day and 11 AM today
export const getLastNightData = async () => {
    try {
        const sensorDataRef = collection(db, 'sensordata');
        const { start, end } = getLastNightRange();

        // Query Firestore for data in the defined range
        const dataQuery = query(
            sensorDataRef,
            where('timestamp', '>=', start),
            where('timestamp', '<=', end),
            orderBy('timestamp', 'asc') // Ensure chronological order
        );

        const querySnapshot = await getDocs(dataQuery);

        // Process and return the fetched data
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log('Fetched Last Night Data:', data);
        return data; // Return raw data directly
    } catch (error) {
        console.error('Error fetching last night data:', error);
        throw error;
    }
};
