import { getPool } from './db.js';
    
// Add User to database
export const add_user = async (username, first_name, last_name, role, phone, email, company_ID) => {
    const connection = await getPool().getConnection();
    
    try {
        const [results] = await connection.execute(
            `CALL add_user(?, ?, ?, ?, ?, ?, ?, @out_user_ID)`, 
            [username, first_name, last_name, role, phone, email, company_ID]
        );

        const [outParams] = await connection.execute(
            `SELECT @out_user_ID as user_ID`
        );
        
        // Extract the returned user_ID from results
        const user_ID = outParams[0]?.user_ID;
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
            `CALL submit_application(?, ?, ?, @status_code, @out_application_ID)`, 
            [driver_ID, application_title, company_ID]
        );
        
        // Retrieve the OUT parameters
        const [outParams] = await connection.execute(
            `SELECT @status_code as status_code, @out_application_ID as application_ID`
        );
        
        const status_code = outParams[0]?.status_code;
        const application_ID = outParams[0]?.application_ID;
        
        if (status_code !== 1) {
            const errorMessages = {
                2: "Invalid driver ID",
                3: "Invalid sponsor",
                4: "Invalid company ID"
            };
            throw new Error(errorMessages[status_code] || `Application submission failed with status code: ${status_code}`);
        }
        
        return {
            user_ID: driver_ID,
            application_ID: application_ID
        };
    } catch (err) {
        console.error("Error submitting application:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};

export const get_company_list = async () => {
    const connection = await getPool().getConnection();
    try {
        const [rows] = await connection.execute(`CALL get_company_list()`);
        return rows;
    } catch (err) {
        console.error("Error fetching company list:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};

export const get_company_id_by_name = async (company_name) => {
    const connection = await getPool().getConnection();
    try {
        const [rows] = await connection.execute(`CALL get_company_id_by_name(?)`, [company_name]);
        if (rows.length > 0 && rows[0].length > 0) {
            return rows[0][0].company_ID;
        } else {
            throw new Error(`Company with name "${company_name}" not found.`);
        }
    } catch (err) {
        console.error("Error fetching company ID by name:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};