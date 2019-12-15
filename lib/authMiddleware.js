const dbHandler = require('./dbHandler');
const bcrypt = require('bcryptjs');

// exports
module.exports = {
    // authentication middleware
    handleSession: (req, res, next) => {
        if (req.session.email && req.session.id && req.session.username) {
            next();
        } else {
            req.session = undefined;
            next();
        }
    },
    // check login
    checkUserLogin: async (req, res, next) => {
        if (req.session !== undefined) {
            // check db for login data
            let data = await dbHandler.isUserInDb(req.session.username, req.session.email);
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
    },
    // check user permission
    checkUserPermissions: async (req, res, next) => {
        let data = await dbHandler.isEmailInDb(req.session.email);
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
    },
    // check permission
    checkUserDishPermissions: async (req, res, next) => {
        let data = await dbHandler.hasUserDishPermissions(req.session.userId, req.params.id);
        let adminQry = await dbHandler.isUserAdmin(req.session.userId);
        if (data || adminQry) {
            next();
        } else {
            console.log("User " + req.session.username + " not allowed to edit dish");
            // no valid login data for this page - redirect to error page
            res.redirect('/');
        }
    },
    // check Admin permission
    checkAdminPermission: async (req, res, next) => {
        let data = await dbHandler.isUserAdmin(req.session.userId);
        if (data) {
            next();
        } else {
            console.log("User " + req.session.username + " is not Admin");
            // no valid admin permission - redirect to error page
            res.redirect('/');
        }

    }
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
};
