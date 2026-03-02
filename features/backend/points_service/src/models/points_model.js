import { get_driver_points } from '../../../../../shared/lib/storedProcedures.js';

export const fetch_driver_points = async (driver_ID) => {
    try {
        const data = await get_driver_points(driver_ID);
        console.log("Raw point_history:", JSON.stringify(data.point_history, null, 2)); // ← add this
        if (data) {
            data.total_points = parseFloat(data.total_points);
            data.point_history = data.point_history.sort((a, b) => 
                new Date(b.point_date) - new Date(a.point_date)
            );
            console.log("Sorted point_history:", JSON.stringify(data.point_history, null, 2)); // ← and this
        }
        return data;
    } catch (err) {
        console.error('Model error:', err.message);
        throw err;
    }
};