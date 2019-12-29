"use strict";

const bcrypt = require('bcryptjs');
const runtime = require('../../config').runtime;

class UserRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    getUser = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.userHandler.getUserInformation(req.params.id);
            res.render('user', {
                session: req.session,
                data: data,
                runtime: runtime
            });
        })();
    };

    getSettings = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.userHandler.getUser(req.session.userId);
            res.render('settings', {
                session: req.session,
                data: data,
                runtime: runtime
            });
        })();
    };

    register = (req, res) => {
        // Check if user exists
        (async () => {
            let qry = await this.dbHandler.userHandler.isUserInDb(req.body.username);
            if (qry) {
                // Exit if user already exists
                res.sendStatus(500);
            } else {
                // Save user in DB
                let hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if (err) reject(err);
                        resolve(hash);
                    });
                });
                let query = await this.dbHandler.userHandler.createUser(req.body.username, req.body.email, hashedPassword);
                if (query) {
                    res.sendStatus(201);
                } else {
                    res.sendStatus(500);
                }
            }
        })();
    };

    // TODO - clean this up -> one route for each option or update whole user db set (update + delete)
    updateSettings = (req, res) => {
        (async () => {
            if (req.body.action === "0") {
                const data = await this.dbHandler.userHandler.changeUsername(req.session.userId, req.body.newUsername);
                if (data) {
                    res.redirect('/');
                } else {
                    res.sendStatus(500);
                }
            } else if (req.body.action === "1") {
                const data = await this.dbHandler.userHandler.changeEmail(req.session.userId, req.body.newEmail);
                if (data) {
                    res.redirect('/');
                } else {
                    res.sendStatus(500);
                }
            } else if (req.body.action === "2") {
                if (req.body.newPassword === req.body.newPassword2) {
                    let myHandler = this.dbHandler;
                    await bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                        (async () => {
                            const data = await myHandler.userHandler.changePassword(req.session.userId, hash);
                            if (data) {
                                res.redirect('/');
                            } else {
                                res.sendStatus(500);
                            }
                        })();
                    });
                } else {
                    console.log("Passwords don't match");
                    res.sendStatus(500);
                }
            } else if (req.body.action === "3") {
                const data = await this.dbHandler.userHandler.deleteAccount(req.session.userId);
                if (data) {
                    req.session.destroy();
                    res.redirect('/');
                } else {
                    res.sendStatus(500);
                }
            } else {
                res.sendStatus(500);
            }
        })();
    };
}

module.exports = UserRoutes;