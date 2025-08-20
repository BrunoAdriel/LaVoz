import mysql from 'mysql2/promise';

export async function getConnection() {
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: true
        }
    });
    return connection;
}