import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath }from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create private var
let pool;

//Create db connection if it doesn't exist
export const getPool = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: {
                ca: fs.readFileSync(path.resolve(__dirname, '../certs/global-bundle.pem')),
                rejectUnauthorized: true
            }, 
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        })
    }
    return pool;
};

//Test connection on startup
export const test_connection = async () => {
    try {
        const connection = await getPool().getConnection();
        console.log(`Successful connection to schema ${process.env.DB_NAME}`);
        connection.release();
    } catch (err) {
        console.error('Connection failed: ', err.message);
        throw err;
    }
};
