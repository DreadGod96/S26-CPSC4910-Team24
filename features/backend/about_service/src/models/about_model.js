//Call DB
import { getPool } from '../../../../../shared/lib/db.js'

//Get row data for about page
export const get_about = async () => {
    try {
        const [rows] = await getPool().query(
            'SELECT team_num, version_num, release_date, product_name, product_desc FROM About_Page');

        return rows[0] || null;

    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};
