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