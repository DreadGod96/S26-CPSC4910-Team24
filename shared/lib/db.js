import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath }from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Create db connection
<<<<<<< HEAD
export const db_connection_pool = mysql.createPool({
=======
export const db_connection_pool = mysql.createConnection({
>>>>>>> 6d27f18 (updated dev branch)
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
<<<<<<< HEAD
    port: DB_PORT,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../certs/global-bundle.pem')),
=======
    port: 3306,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../certs/global-budle.pem')),
>>>>>>> 6d27f18 (updated dev branch)
        rejectUnauthorized: true
    }, 
    waitForConnections: true,
    connectionLimit: 10,
<<<<<<< HEAD
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true
    keepAliveInitialDelay: 0
=======
    queueLimit: 0,
>>>>>>> 6d27f18 (updated dev branch)
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
