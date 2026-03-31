import { getPool } from '../../../../../shared/lib/db.js';

// Get all users
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
            FROM \`User\`
        `);

        return rows || null;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};

// Get one user by ID
export const get_user_by_id = async (user_id) => {
    try {
        const [rows] = await getPool().query(`
            SELECT 
                user_ID,
                user_fname,
                user_lname,
                user_email,
                user_role,
                user_username,
                user_phone_number,
                user_join_date,
                user_end_date,
                company_ID
            FROM \`User\`
            WHERE user_ID = ?
        `, [user_id]);

        return rows[0] || null;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};

export const update_user_field = async (user_id, field, value) => {
    const allowedFields = [
        'user_fname',
        'user_lname',
        'user_email',
        'user_username',
        'user_phone_number',
        'user_role',
        'user_join_date',
        'user_end_date',
        'company_ID'
    ];

    if (!allowedFields.includes(field)) {
        throw new Error('Invalid field');
    }

    try {
        const [result] = await getPool().query(`
            UPDATE \`User\`
            SET ${field} = ?
            WHERE user_ID = ?
        `, [value, user_id]);

        return result;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};

// ... existing get_users and get_user_by_id ...

export const update_user_profile = async (user_id, updates) => {
    const allowedFields = ['user_fname', 'user_lname', 'user_email', 'user_phone_number', 'user_username'];
    
    // Filter out any unapproved fields sent from the frontend
    const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = updates[key];
            return obj;
        }, {});

    if (Object.keys(filteredUpdates).length === 0) return null;

    const setClause = Object.keys(filteredUpdates).map(key => `\`${key}\` = ?`).join(', ');
    const values = [...Object.values(filteredUpdates), user_id];

    try {
        const [result] = await getPool().query(`
            UPDATE \`User\` 
            SET ${setClause} 
            WHERE user_ID = ?
        `, values);
        return result;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};


export const delete_user = async (user_id) => {
    try {
        const [result] = await getPool().query(`
            UPDATE \`User\`
            SET user_end_date = CURDATE()
            WHERE user_ID = ?
        `, [user_id]);

        return result;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};