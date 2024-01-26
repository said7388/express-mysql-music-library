import { createPool } from 'mysql2/promise';

export async function database() {
    const connection = createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    return connection;
}

