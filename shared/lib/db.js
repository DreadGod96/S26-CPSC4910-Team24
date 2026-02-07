import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath }from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Create db connection
export const db_connection_pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    port: 3306,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../certs/global-budle.pem')),
        rejectUnauthorized: true
    }, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

//Test connection on startup
export const test_connection = async () => {
    try {
        const connection = await db_connection_pool.getConnection();
        console.log(`Successful connection to schema ${process.env.DB_NAME}`);
        connection.release();
    } catch (err) {
        console.error('Connection failed: ', err.message);
    }
};
