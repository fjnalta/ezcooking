"use strict";

class UserHandler {

    constructor(dbHandler) {
        console.log('UserHandler initialized');
        this.dbHandler = dbHandler;
    }

    createUser = async (name, email, password) => {
        // Prepare data according to DB scheme
        let records = {
            name: name,
            email: email,
            password: password,
            role: 'U'
        };

        try {
            let res = await this.dbHandler.query({sql: "INSERT INTO users SET ?"}, records);
            return true;
        } catch (e) {
            console.log('Error creating user');
            console.log(e);
            return false;
        }
    };

    isUserInDb = async (name) => {
        try {
            let res = await this.dbHandler.query({sql: "SELECT * FROM users WHERE name = ?"}, name);
            if (res.length > 0) {
                return res;
            } else {
                return false;
            }
        } catch (e) {
            return "Error loading User" + e;
        }
    };

    isEmailInDb = async (name) => {
        try {
            let res = await this.dbHandler.query({sql: "SELECT * FROM users WHERE email = ?"}, name);
            if (res.length > 0) {
                return res;
            } else {
                return false;
            }
        } catch (e) {
            console.log("Error loading User" + e);
            return false;
        }
    };

    getUser = async (id) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT * FROM users WHERE id = ?"}, id);
        } catch (e) {
            console.log(e);
            console.log('Error getting User');
        }
        return res[0];
    };

    getUserId = async (username) => {
        try {
            let res = await this.dbHandler.query({sql: "SELECT id FROM users WHERE name = ?"}, username);
            return res[0].id;
        } catch (e) {
            return "Error loading userId" + e;
        }
    };

    getUserInformation = async (id) => {
        try {
            let data = {};
            let user = await this.dbHandler.query({ sql: "SELECT name from users WHERE id = ?" }, id);
            let dishes = await this.dbHandler.dishHandler.getDishes(id);
            data['user'] = user;
            data['dishes'] = dishes;
            return data;
        } catch (e) {
            console.log('Error loading user information');
            console.log(e);
            return false;
        }
    };

    hasUserDishPermissions = async (userId, dishId) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT creator_id FROM dish WHERE id = ?"}, dishId);
        } catch (e) {
            console.log('Error getting User dish permissions');
            console.log(e);
        }
        return res[0].creator_id === userId;
    };

    isUserAdmin = async (userId) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT role FROM users WHERE id = ?"}, userId);
        } catch (e) {
            console.log('Error getting User Admin permissions');
            console.log(e);
        }
        if (res[0].role === 'A') {
            return true;
        } else {
            return false;
        }
    };

    changeUsername = async (userId, newUsername) => {
        try {
            return await this.dbHandler.query({sql: "UPDATE users SET ? WHERE id = ?"}, [{name: newUsername}, userId]);
        } catch (e) {
            console.log('Error change username');
            console.log(e);
            return false;
        }
    };

    changeEmail = async (userId, newEmail) => {
        try {
            return await this.dbHandler.query({sql: "UPDATE users SET ? WHERE id = ?"}, [{email: newEmail}, userId]);
        } catch (e) {
            console.log('Error change username');
            console.log(e);
            return false;
        }
    };

    changePassword = async (userId, newPassword) => {
        try {
            return await this.dbHandler.query({sql: "UPDATE users SET ? WHERE id = ?"}, [{password: newPassword}, userId]);
        } catch (e) {
            console.log('Error change password');
            console.log(e);
            return false;
        }
    };

    deleteAccount = async (userId) => {
        try {
            let qry = await this.dbHandler.query({sql: "UPDATE dish SET ? WHERE creator_id = ?"}, [{creator_id: 1}, userId]);
            return await this.dbHandler.query({sql: "DELETE FROM users WHERE id = ?"}, userId);
        } catch (e) {
            console.log('Error delete user');
            console.log(e);
            return false;
        }
    };
}

module.exports = UserHandler;