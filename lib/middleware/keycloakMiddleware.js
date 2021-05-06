"use strict";

const runtime = require('../../config').runtime;

class KeycloakMiddleware {

    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    checkLogin = (req, res, next) => {
        if(this.isEmpty(req.kauth)) {
            next();
        } else {
            res.auth = req.kauth.grant.access_token.content;
            res.auth.privileges = 'U';
            for(let i = 0; i < res.auth.realm_access.roles.length; i++) {
                if(res.auth.realm_access.roles[i] == 'ezchef-admin') {
                    res.auth.privileges = 'A';
                }
            }
            next();
        }
    };

    checkUserPermissions = (req, res, next) => {
        let userRoleFound = false;
        if(res.auth) {
            for(let i = 0; i < res.auth.realm_access.roles.length; i++) {
                if(res.auth.realm_access.roles[i] === 'ezchef-user' || res.auth.realm_access.roles[i] === 'ezchef-admin') {
                    userRoleFound = true;
                }
            }
            if(userRoleFound) {
                next();
            } else {
                res.render('errors/noPermissionError', {
                    session: undefined,
                    runtime: runtime
                });
            }
        } else {
            res.render('errors/noPermissionError', {
                session: undefined,
                runtime: runtime
            });
        }
    };

    checkUserDishPermissions = async (req, res, next) => {
        if(res.auth) {
            let userIsAdmin = false;
            // check if user has permissions to edit dish
            let data = await this.dbHandler.dishHandler.isUserDishOwner(res.auth.preferred_username, req.params.id);
            // check if user is admin
            console.log(data);
            for(let i = 0; i < res.auth.realm_access.roles.length; i++) {
                if(res.auth.realm_access.roles[i] === 'ezchef-admin') {
                    userIsAdmin = true;
                }
            }
            if(userIsAdmin || data) {
                next();
            } else {
                res.render('errors/noPermissionError', {
                    session: undefined,
                    runtime: runtime
                });
            }
        } else {
            res.render('errors/noPermissionError', {
                session: undefined,
                runtime: runtime
            });
        }
    };

    checkAdminPermission = (req, res, next) => {
        if(res.auth) {
            let userIsAdmin = false;
            for(let i = 0; i < res.auth.realm_access.roles.length; i++) {
                if(res.auth.realm_access.roles[i] === 'ezchef-admin') {
                    userIsAdmin = true;
                }
            }
            if(userIsAdmin) {
                next();
            } else {
                res.render('errors/noPermissionError', {
                    session: undefined,
                    runtime: runtime
                });
            }
        } else {
            res.render('errors/noPermissionError', {
                session: undefined,
                runtime: runtime
            });
        }
    };

    // helper functions
    isEmpty = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
}

module.exports = KeycloakMiddleware;