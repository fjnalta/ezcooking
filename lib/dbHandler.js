"use strict";

const config = require('../config');
const mysql = require('promise-mysql');

const DishHandler = require('./dbHandler/dishHandler');
const CategoryHandler = require('./dbHandler/categoryHandler');
const AdminHandler = require('./dbHandler/adminHandler');

class DbHandler {

    constructor() {
        // connect database & create pool
        (async () => {
            await this.createPool();
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
}

module.exports = DbHandler;