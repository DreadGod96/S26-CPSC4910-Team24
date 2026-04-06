import { getPool } from './db.js';
    
// Add User to database
export const add_user = async (username, password, first_name, last_name, role, phone, email, company_ID) => {
    const connection = await getPool().getConnection();
    
    try {
        const [results] = await connection.execute(
            `CALL add_user(?, ?, ?, ?, ?, ?, ?, ?)`, 
            [username, password, first_name, last_name, role, phone, email, company_ID]
        );
        return;
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

export const get_driver_applications = async (driver_ID) => {
    const connection = await getPool().getConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT
                a.application_ID,
                a.application_name,
                a.application_status,
                a.application_date,
                c.company_name
            FROM Application a
            LEFT JOIN Company c ON c.user_ID = a.sponsor_ID
            WHERE a.driver_ID = ?
            ORDER BY a.application_date DESC, a.application_ID DESC`,
            [driver_ID]
        );
        return rows;
    } catch (err) {
        console.error("Error fetching driver applications:", err.message);
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

export const get_driver_points = async (driver_ID) => {
    const connection = await getPool().getConnection();
    try {
        const [totalRows] = await connection.execute(
            `SELECT driver_ID, point_amount
             FROM Points
             WHERE driver_ID = ?`,
            [driver_ID]
        );

        const [historyRows] = await connection.execute(
            `SELECT
                point_date,
                point_amount,
                points_reason,
                sponsor_ID
             FROM Points_History
             WHERE driver_ID = ?
             ORDER BY point_date DESC`,
            [driver_ID]
        );

        return {
            driver_ID,
            total_points: totalRows[0]?.point_amount ?? 0,
            point_history: historyRows
        };
    } catch (err) {
        console.error("Error fetching driver points:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};

export const modify_driver_points = async (
    driver_ID,
    point_amount,
    sponsor_ID,
    points_reason
) => {
    const connection = await getPool().getConnection();
    try {
        await connection.execute(
            `CALL modify_points(?, ?, ?, ?)`,
            [driver_ID, point_amount, sponsor_ID, points_reason]
        );

        return await get_driver_points(driver_ID);
    } catch (err) {
        console.error("Error modifying driver points:", err.message);
        throw err;
    } finally {
        connection.release();
    }
};

// ─── Dominos Catalog & Order ──────────────────────────────────────────────────

/**
 * Insert or update a single product row keyed on its Dominos product_code.
 * Safe to call repeatedly — updates name/price/desc if the code already exists.
 */
export const upsert_product = async (code, name, price, desc) => {
    const connection = await getPool().getConnection();
    try {
        await connection.execute(
            `CALL upsert_product(?, ?, ?, ?)`,
            [code, name, parseFloat(price), desc ?? null]
        );
    } catch (err) {
        console.error(`Error upserting product [${code}]:`, err.message);
        throw err;
    } finally {
        connection.release();
    }
};

/**
 * Create a new Order row and return the generated order_ID.
 * @param {number} user_ID
 * @param {number} cost      - total cost in dollars
 * @param {string} status    - e.g. "confirmed"
 * @returns {Promise<number>} order_ID
 */
export const create_order = async (user_ID, cost, status) => {
    const connection = await getPool().getConnection();
    try {
        await connection.execute(
            `CALL create_order(?, ?, ?, @order_id)`,
            [user_ID, parseFloat(cost), status]
        );
        const [[row]] = await connection.execute(`SELECT @order_id AS order_ID`);
        return row.order_ID;
    } catch (err) {
        console.error('Error creating order:', err.message);
        throw err;
    } finally {
        connection.release();
    }
};

/**
 * Add a single item to an existing order.
 * Resolves the Dominos product_code to a product_ID internally.
 * Silently skips if the product_code has not been synced yet.
 * @param {number} order_ID
 * @param {string} product_code  - e.g. "14SCREEN"
 */
export const add_order_item = async (order_ID, product_code) => {
    const connection = await getPool().getConnection();
    try {
        await connection.execute(
            `CALL add_order_item(?, ?)`,
            [order_ID, product_code]
        );
    } catch (err) {
        console.error(`Error adding order item [${product_code}]:`, err.message);
        throw err;
    } finally {
        connection.release();
    }
};