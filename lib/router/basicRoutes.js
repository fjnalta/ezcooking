"use strict";

const bcrypt = require('bcryptjs');
const runtime = require('../../config').runtime;

class BasicRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    login = (req, res) => {
        // TODO - move logic to input middleware
        let data;
        if (req.body.email && req.body.password !== undefined) {
            (async () => {
                try {
                    data = await this.dbHandler.userHandler.isEmailInDb(req.body.email);
                    // User available in DB
                    if (data) {
                        // check pw
                        bcrypt.compare(req.body.password, data[0].password, function (err, passCheck) {
                            if (passCheck) {
                                // Passwords match
                                req.session.userId = data[0].id;
                                req.session.username = data[0].name;
                                req.session.email = data[0].email;
                                req.session.privileges = data[0].role;
                                res.redirect('/');
                            } else {
                                // Passwords don't match
                                res.sendStatus(500);
                            }
                        });
                    } else {
                        // Login - Login Failed
                        res.sendStatus(500);
                    }
                } catch (e) {
                    res.sendStatus(500);
                }
            })();
        }
    };

    logout = (req, res) => {
        req.session.destroy();
        res.redirect('/');
    };

    index = (req, res) => {
        (async () => {
            let data;
            data = await this.dbHandler.dishHandler.getLatestDishes();
            res.render('index', {
                session: req.session,
                data: data,
                runtime : runtime
            });
        })();
    };

    browse = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.categoryHandler.getCategoryOverview();
            res.render('browse', {
                session: req.session,
                data: data,
                runtime: runtime
            });
        })();
    };

    // TODO - implement real error handling
    error = (req, res) => {
        res.render('errors/notFoundError', {
            session: req.session,
            runtime: runtime
        });
    };
}

module.exports = BasicRoutes;