//Call DB
import { db_connection_pool } from '../../../../../shared/lib/db.js'

//Get row data for about page
export const get_about_data = async () => {
    try {
        const [row_data] = await db_connection_pool.query(
            'SELECT team_num, version_num, release_date, product_name, product_desc FROM About_Page');

        return row_data[0] || null;

    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};
