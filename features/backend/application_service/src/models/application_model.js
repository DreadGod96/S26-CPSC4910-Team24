//Call DB
import { submit_application, get_company_list as get_company_list_sp , get_company_id_by_name as get_company_id_by_name_sp} from '../../../../../shared/lib/storedProcedures.js'

export const post_application = async (driver_ID, application_title, company_ID) => {
    try {
        const result = await submit_application(driver_ID, application_title, company_ID);

        return result;

    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};

export const get_company_list = async () => {
    try {
        const result = await get_company_list_sp();
        return result;
    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};

export const get_company_id_by_name = async (company_name) => {
    try {
        const [rows] = await get_company_id_by_name_sp(company_name);
        return rows[0][0].company_ID;
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};