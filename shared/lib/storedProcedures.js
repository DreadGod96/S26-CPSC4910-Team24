import { db_connection_pool } from './db.js';

export const connect_to_database = async () => {
    try {
        const connection = await db_connection_pool.getConnection();
        console.log("Database connection established.");
        return connection;
    } catch (err) {
        console.error("Error connecting to database:", err.message);
        throw err;
    }
};

// Add User to database
export const add_user = async (username, first_name, last_name, role, phone, email, company_ID) => {
    const connection = await db_connection_pool.getConnection();
    
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
    const connection = await db_connection_pool.getConnection();
    
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

export const get_user_by_email = async (email) => {
    const connection = await db_connection_pool.getConnection();
    try {
        const [results] = await connection.execute(
            `CALL get_user_by_email(?)`, 
            [email]
        );
        return results[0][0]; // Assuming the stored procedure returns a single user
    } catch (err) {
        console.error("Error fetching user by email:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};

export const get_company_id_by_name = async (company_name) => {
    const connection = await db_connection_pool.getConnection();
    try {
        const [results] = await connection.execute(
            `CALL get_company_id_by_name(?)`, 
            [company_name]
        );
        return results[0][0]?.company_ID; // Assuming the stored procedure returns a single company
    } catch (err) {
        console.error("Error fetching company ID by name:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};