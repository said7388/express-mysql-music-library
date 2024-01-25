import mysql from 'mysql';
require('dotenv').config();

// Create mySQL Connection Pool
const database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT as unknown as number || 3306,
});

database.connect(function (err: Error) {
    if (err) {
        console.error('error connecting: ' + err);
        return;
    }

    console.log('database connection established');
});

export default database;