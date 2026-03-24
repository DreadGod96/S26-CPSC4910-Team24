import { getPool } from '../../../../../shared/lib/db.js';

export const get_users = async () => {
    try {
        const [rows] = await getPool().query(`
            SELECT 
                user_ID,
                user_fname,
                user_lname,
                user_email,
                user_role,
                user_username,
                user_phone_number
            FROM User
        `);

        return rows || null;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};