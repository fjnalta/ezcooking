"use strict";

const bcrypt = require('bcryptjs');
const runtime = require('../../config').runtime;

class UserRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    getUserInformation = (req, res) => {
        (async () => {
            let data = {};
            data['user'] = req.params.id;
            try {
                let dishes = await this.dbHandler.dishHandler.getDishes(req.params.id);
                data['dishes'] = dishes;
                res.render('user', {
                    session: res.auth,
                    data: data,
                    runtime: runtime
                });
            } catch (e) {
                console.log('Error loading user information');
                console.log(e);
            }
        })();
    };

    getSettings = (req, res) => {
        res.render('settings', {
            session: res.auth,
            runtime: runtime
        });
    };
}

module.exports = UserRoutes;