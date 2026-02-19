//Call DB
import { submit_application, add_user } from '../../../../../shared/lib/storedProcedures.js'

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


export const create_user_and_submit_application = async (first_name, last_name, email, phone, application_title, company_ID) => {
    try {
        // Step 1: Add user to database
        const username = first_name[0] + last_name;
        const driver_ID = await add_user(username, first_name, last_name, 'DRIVER', phone, email, company_ID);
        
        if (!driver_ID) {
            throw new Error("Failed to create user");
        }

        // Step 2: Submit application with newly created driver ID
        const application_ID = await submit_application(driver_ID, application_title, company_ID);

        if (!application_ID) {
            throw new Error("Failed to submit application");
        }

        return {
            user_ID: driver_ID,
            application_ID: application_ID
        };

    } catch (err) {
        console.error('Model error: ', err.message);
        throw err;
    }
};