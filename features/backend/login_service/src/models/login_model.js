import { getPool } from '../../../../../shared/lib/db.js';
import { add_user } from '../../../../../shared/lib/storedProcedures.js';
const findUser = async (email) => {
    try {

        const sql_cmd = `SELECT * FROM users WHERE user_email = ?`;
        const [rows] = await getPool().query(sql_cmd, [email]);
        return rows[0] || null;
    
    } catch (err) {
        console.error("Database error in findUser:", err.message);
        throw err;
    }
};

const Authenticate = {
    findUser,
};

export default Authenticate;

