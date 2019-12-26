"use strict";



class DbConnection {

    constructor() {
        console.log('DB Connection Handler initialized');
        (async () => {
            if (this.mySQLPool === undefined) {
                console.log('Create new Database Pool');
                this.mySQLPool = await mysql.createPool(config.mysql);
            } else {
                console.log('Found Database Pool');
            }
        })();
    }

    testConnection = async () => {
        console.log('Perform Database Test');
        await this.mySQLPool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection closed.');
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection refused.');
                } else {
                    console.error(err);
                }
            }
            if (connection) {
                console.log('Database Test Succeeded');
                connection.release();
            }
        });
    }
}

module.exports = DbConnection;