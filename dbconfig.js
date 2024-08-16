const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'Asset',
    options: {
        trustServerCertificate: true // For local development with self-signed certificates
    },
    authentication: {
        type: 'ntlm', // For Windows Authentication
        options: {
            userName: 'hp', 
            password: 'open',
            domain: 'GANZA'
        }
    }
};

const poolPromise = sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to SQL Server');
    }
    return pool;
}).catch(err => {
    console.error('SQL connection error: ', err);
});

module.exports = { sql, poolPromise };