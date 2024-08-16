const { sql, poolPromise } = require('./dbconfig');

async function testDatabase() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT TOP 2 * FROM sys.tables');
        console.log('Query Result:', result.recordset);
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        sql.close();
    }
}

testDatabase();
