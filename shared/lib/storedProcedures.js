import { getPool } from './db.js';
    
// Add User to database
export const add_user = async (username, first_name, last_name, role, phone, email, company_ID) => {
    const connection = await getPool().getConnection();
    
    try {
        const [results] = await connection.execute(
            `CALL add_user(?, ?, ?, ?, ?, ?, ?)`, 
            [username, first_name, last_name, role, phone, email, company_ID]
        );
        
        // Extract the returned user_ID from results
        const user_ID = results[0]?.user_ID;
        return user_ID;
    } catch (err) {
        console.error("Error adding user:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};

// Submit Application
export const submit_application = async (driver_ID, application_title, company_ID) => {
    const connection = await getPool().getConnection();
    
    try {
        const [results] = await connection.execute(
            `CALL submit_application(?, ?, ?)`, 
            [driver_ID, application_title, company_ID]
        );
        
        const application_ID = results[0]?.application_ID;
        const status_code = results[0]?.status_code;
        
        if (status_code !== 1) {
            throw new Error("Application submission failed with status code: " + status_code);
        }
        
        return application_ID;
    } catch (err) {
        console.error("Error submitting application:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};