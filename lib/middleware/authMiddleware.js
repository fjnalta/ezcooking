"use strict";

const bcrypt = require('bcryptjs');
const runtime = require('../../config').runtime;

class AuthMiddleware {

    constructor(dbHandler) {
        console.log('AuthMiddleware initialized');
        this.dbHandler = dbHandler;
    }

    // authentication middleware
    handleSession = (req, res, next) => {
        if (req.session.email && req.session.id && req.session.username) {
            next();
        } else {
            req.session = undefined;
            next();
        }
    };

    // check login
    checkUserLogin = async (req, res, next) => {
        if (req.session !== undefined) {
            // check db for login data
            let data = await this.dbHandler.userHandler.isUserInDb(req.session.username, req.session.email);
            if (data) {
                next();
            } else {
                res.render('errors/noPermissionError', {
                    session: undefined,
                    runtime: runtime
                });
            }
        } else {
            // no valid login data for this page - redirect to error page
            res.render('errors/noPermissionError', {
                session: undefined,
                runtime: runtime

            });
        }
    };

    // check user permission
    checkUserPermissions = async (req, res, next) => {
        let data = await this.dbHandler.userHandler.isEmailInDb(req.session.email);
        bcrypt.compare(req.body.password, data[0].password).then(
            result => {
                if (result) {
                    // valid User
                    next();
                } else {
                    // invalid User
                    res.redirect('/settings');
                }
            },
            err => {
                // no valid login data for this action - redirect to error page
                console.log(err);
                res.redirect('/settings');
            });
    };

    // check permission
    checkUserDishPermissions = async (req, res, next) => {
        let data = await this.dbHandler.userHandler.hasUserDishPermissions(req.session.userId, req.params.id);
        let adminQry = this.dbHandler.userHandler.isUserAdmin(req.session.userId);
        if (data || adminQry) {
            next();
        } else {
            console.log("User " + req.session.username + " not allowed to edit dish");
            // no valid login data for this page - redirect to error page
            res.redirect('/');
        }
    };

    // check Admin permission
    checkAdminPermission = async (req, res, next) => {
        let data = await this.dbHandler.userHandler.isUserAdmin(req.session.userId);
        if (data) {
            next();
        } else {
            console.log("User " + req.session.username + " is not Admin");
            // no valid admin permission - redirect to error page
            res.redirect('/');
        }
    };

}

module.exports = AuthMiddleware;