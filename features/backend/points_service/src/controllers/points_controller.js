import {
    fetch_driver_points,
    adjust_driver_points
} from '../models/points_model.js';

export const get_points = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid or missing user_id' });
    }

    try {
        const data = await fetch_driver_points(Number(user_id));

        if (!data) {
            return res.status(404).json({ error: `No points found for user_id: ${user_id}` });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error('Controller error:', err.message);
        return res.status(500).json({
        error: 'Internal server error',
        details: err.message
        });
    }
};

export const update_points = async (req, res) => {
    const { driver_id, point_amount, sponsor_id, reason } = req.body;

    if (!driver_id || isNaN(driver_id)) {
        return res.status(400).json({ error: 'Invalid or missing driver_id' });
    }

    if (point_amount === undefined || point_amount === null || isNaN(point_amount)) {
        return res.status(400).json({ error: 'Invalid or missing point_amount' });
    }

    if (!sponsor_id || isNaN(sponsor_id)) {
        return res.status(400).json({ error: 'Invalid or missing sponsor_id' });
    }
    console.log('update_points body:', req.body);

    try {
        const data = await adjust_driver_points(
            Number(driver_id),
            Number(point_amount),
            Number(sponsor_id),
            reason?.trim() || 'Admin adjustment'
        );

        return res.status(200).json(data);
    } catch (err) {
        console.error('Controller error:', err.message);
        return res.status(500).json({
        error: 'Internal server error',
        details: err.message
        });
    }
};