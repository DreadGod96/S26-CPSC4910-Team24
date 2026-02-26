import { getPool } from '../../../../../shared/lib/db.js';

export const findUser = async (user_email) => {
    try {
        const sql_cmd = `
        SELECT u.user_ID,  u.user_email, u.user_role, l.password_hash
        FROM user u  JOIN login l ON u.user_ID = l.user_ID
        WHERE u.user_email = ?`;
        
        const [rows] = await getPool().query(sql_cmd, [user_email]);
        return rows[0] || null;
    
    } catch (err) {
        console.error("Database error in findUser:", err.message);
        throw err;
    }
};
