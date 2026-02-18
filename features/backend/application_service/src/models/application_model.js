//Call DB
import { submit_application } from '../../../../../shared/lib/storedProcedures.js'

//Get row data for about page
export const post_application = async (driver_ID, application_title, company_ID) => {
    try {
        const rows = await submit_application(driver_ID, application_title, company_ID);

        return rows[0] || null;

    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};
