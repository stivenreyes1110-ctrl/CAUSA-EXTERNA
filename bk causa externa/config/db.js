const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER || 'BELEN',
    password: process.env.DB_PASSWORD || 'DGH2013',
    server: process.env.DB_SERVER || '128.0.13.1',
    database: process.env.DB_DATABASE || 'DGEMPRES01',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

const conexion = async () => {
    if (pool?.connected) return pool;
    pool = await sql.connect(dbConfig);
    return pool;
};

module.exports = { conexion };
