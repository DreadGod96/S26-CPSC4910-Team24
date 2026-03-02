import { get_driver_points } from '../../../../../shared/lib/storedProcedures.js';

export const fetch_driver_points = async (driver_ID) => {
    try {
        const data = await get_driver_points(driver_ID);
        return data;
    } catch (err) {
        console.error('Model error:', err.message);
        throw err;
    }
};