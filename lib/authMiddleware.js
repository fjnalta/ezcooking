const dbHandler = require('./dbHandler');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');


// authentication middleware
const handleSession = (req, res, next) => {
    if (req.session.email && req.session.id && req.session.username) {
        next();
    } else {
        req.session = undefined;
        next();
    }
};

// check login
const checkUserLogin = async (req, res, next) => {
    let data;
    if (req.session !== undefined) {
        // check db for login data
        data = await dbHandler.isUserInDb(req.session.username, req.session.email);
        if (data) {
            next();
        } else {
            res.render('error', {
                session: undefined
            });
        }
    } else {
        // no valid login data for this page - redirect to error page
        res.render('error', {
            session: undefined
        });
    }
};

const checkUserPermissions = async (req, res, next) => {
    let data;
    data = await dbHandler.isEmailInDb(req.session.email);
    bcrypt.compare(req.body.password, data[0].password).then(
        result => {
            if(result) {
                // valid User
                next();
            } else {
                // invalid User
                res.redirect('/settings');
            }
        },
        err => {
            // no valid login data for this action - redirect to error page
            res.redirect('/settings');
        });
};

// check permission
const checkUserDishPermissions = async (req, res, next) => {
    let data = await dbHandler.hasUserDishPermissions(req.session.userId, req.params.id);
    if (data) {
        next();
    } else {
        console.log("User " + req.session.username + " not allowed to edit dish");
        // no valid login data for this page - redirect to error page
        res.render('error', {
            session: undefined
        });
    }
};

// function requiresAdmin(req, res, next) {
//    pool.query("SELECT role FROM users WHERE name = ?", req.session.username, function (err, result, fields) {
//        if(err) {
//            throw err;
//        } else {
//            if(result.length > 0 && result[0].role == 'A') {
//                return next();
//            } else {
//                return res.redirect('/');
//            }
//        }
//    });
// }

module.exports = {
    handleSession,
    checkUserLogin,
    checkUserPermissions,
    checkUserDishPermissions
};