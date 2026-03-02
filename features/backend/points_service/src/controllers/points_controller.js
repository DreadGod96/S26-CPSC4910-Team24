import { fetch_driver_points } from '../models/points_model.js';

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
        return res.status(500).json({ error: 'Internal server error' });
    }
};