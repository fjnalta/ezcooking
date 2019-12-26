"use strict";

const config = require('../config');
const mysql = require('promise-mysql');

const UserAccess = require('./dbHandler/userHandler');
const DishHandler = require('./dbHandler/dishHandler');
const CategoryHandler = require('./dbHandler/categoryHandler');
const AdminHandler = require('./dbHandler/adminHandler');

class DbHandler {

    constructor() {
        // connect database & create pool
        (async () => {
            await this.createPool();

            this.userHandler = new UserAccess(this.mySQLPool);
            this.dishHandler = new DishHandler(this.mySQLPool);
            this.categoryHandler = new CategoryHandler(this.mySQLPool);
            this.adminHandler = new AdminHandler(this.mySQLPool);
        })();
    }

    createPool = async () => {
        if (this.mySQLPool === undefined) {
            console.log('Create new Database Pool');
            this.mySQLPool = await mysql.createPool(config.mysql);
        } else {
            console.log('Found Database Pool');
        }
        console.log('DbHandler initialized');
    };

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
    };
}

module.exports = DbHandler;