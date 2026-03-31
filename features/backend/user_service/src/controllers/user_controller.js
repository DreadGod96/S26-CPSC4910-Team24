import * as user_model from '../models/user_model.js';

export const pull_users = async (req, res) => {
    try {
        const users = await user_model.get_users();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'There are no users' });
        }

        res.status(200).json(users);
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: 'Error pulling users from RDS' });
    }
};

export const pull_user_by_id = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_model.get_user_by_id(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: 'Error pulling user from RDS' });
    }
};

export const update_user_field_controller = async (req, res) => {
    try {
        const { id } = req.params;
        const { field, value } = req.body;

        if (!field) {
            return res.status(400).json({ error: 'Field is required' });
        }

        const result = await user_model.update_user_field(id, field, value);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await user_model.get_user_by_id(id);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: 'Error updating user in RDS' });
    }
};


export const update_settings_controller = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No data provided for update' });
        }

        const result = await user_model.update_user_profile(id, updates);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Pull fresh data to send back to the React app
        const updatedUser = await user_model.get_user_by_id(id);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: 'Error saving settings to RDS' });
    }
};

export const delete_user_controller = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await user_model.delete_user(id);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User account ended successfully' });
    } catch (err) {
        console.error('Controller error deleting user:', err);
        res.status(500).json({
            error: 'Error ending user account in RDS',
            details: err.message
        });
    }
};