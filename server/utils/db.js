const sql = require('mssql/msnodesqlv8');
const config = require('../config');

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server!');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed! ', err);
        process.exit(1);
    });

module.exports = {
    sql, 
    poolPromise 
};
