const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.host || 'localhost',
    user: process.env.user || 'root',
    password: process.env.password || '',
    database: process.env.database || 'project_swiggy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
