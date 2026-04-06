import * as sp from '../../../../../shared/lib/storedProcedures.js';

console.log("POINTS MODEL IMPORT PATH HIT");
console.log("storedProcedures exports:", Object.keys(sp));

export const fetch_driver_points = async (driver_ID) => {
    try {
        const data = await sp.get_driver_points(driver_ID);

        if (data) {
            data.total_points = parseFloat(data.total_points);
            data.point_history = (data.point_history || []).sort(
                (a, b) => new Date(b.point_date) - new Date(a.point_date)
            );
        }

        return data;
    } catch (err) {
        console.error('Model error:', err.message);
        throw err;
    }
};

export const adjust_driver_points = async (
    driver_ID,
    point_amount,
    sponsor_ID,
    points_reason
) => {
    try {
        const data = await sp.modify_driver_points(
            driver_ID,
            point_amount,
            sponsor_ID,
            points_reason
        );

        if (data) {
            data.total_points = parseFloat(data.total_points);
            data.point_history = (data.point_history || []).sort(
                (a, b) => new Date(b.point_date) - new Date(a.point_date)
            );
        }

        return data;
    } catch (err) {
        console.error('Model error:', err.message);
        throw err;
    }
};