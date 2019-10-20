// personal imports
const config = require('../config');
const dbHandler = require('./dbHandler');

// generic imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');

// setup express router
const router = express.Router();

// configure upload destination
const upload = multer({dest: 'public/uploads/'});

// authentication middleware
function handleSession(req, res, next) {
    if (req.session.email && req.session.id && req.session.username) {
        return next();
    } else {
        req.session = undefined;
        return next();
    }
}

// check login
async function checkUserLogin(req, res, next) {
    let data;
    if (req.session !== undefined) {
        // check db for login data
        (async () => {
            data = await dbHandler.isUserInDb(req.session.username, req.session.email);
            if (data) {
                return next();
            }
        })();
    } else {
        // no valid login data for this page - redirect to error page
        return res.render('error', {
            session: undefined
        });
    }
}

async function checkUserPermissions(req, res, next) {
    let data;
    (async () => {
        data = await dbHandler.isEmailInDb(req.session.email);
        bcrypt.compare(req.body.password, data[0].password).then(
            result => {
                console.log("Valid User");
                return next();
            },
            err => {
                // no valid login data for this action - redirect to error page
                res.render('error', {
                    session: undefined
                });
            }
        ).catch(function (err) {
            console.error('bcrypt' + err);
        });
    })();
}

// check permission
function checkUserDishPermissions(req, res, next) {
    let data;
    (async () => {
        data = await dbHandler.hasUserDishPermissions(req.session.userId, req.params.id);
        if (data) {
            return next();
        } else {
            console.log("User " + req.session.username + " not allowed to edit dish " + req.params.id);
            // no valid login data for this page - redirect to error page
            return res.render('error', {
                session: undefined
            });
        }
    })();
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

// GET - routes
// ------------
// basic routes
router.get('/', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getLatestDishes();
        res.render('index', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/indices', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getIndices();
        res.json(data);
    })();
});

router.get('/dish/:id', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDish(req.params.id);
        res.render('dish', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/dish/:id/edit', handleSession, checkUserLogin, checkUserDishPermissions, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDish(req.params.id);
        console.log(data);
        res.render('edit-dish', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/browse', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getCategories();
        res.render('browse', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/browse/:category', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getSubCategories(req.params.category);
        res.render('categories', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/browse/:category/sub/:subcategory', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDishes(req.params.subcategory);
        res.render('sub-categories', {
            session: req.session,
            data: data
        });
    })();
});

// need authentication + need permission
router.get('/dish', handleSession, checkUserLogin, function (req, res) {
    res.render('add-dish', {session: req.session});
});

router.get('/settings', handleSession, checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getUser(req.session.userId);
        res.render('settings', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/mydishes', handleSession, checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getMyDishes(req.session.userId);
        res.render('myDishes', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/favorites', handleSession, checkUserLogin, function (req, res) {
    let data;
    // TODO - load favorites from db
    res.render('favorites', {
        session: req.session,
        data: data
    });
});

// Load Data
//----------

// Load Ingredients
router.get('/ingredients', handleSession, checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getIngredientNames();
        await res.json(data);
    })();
});

// Load Categories
router.get('/categories', handleSession, checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getCategoryNames();
        await res.json(data);
    })();
});

// Load SubCategory
router.get('/categories/:id', handleSession, checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getSubCategoryNames(req.params.id);
        await res.json(data);
    })();
});


// need authentication + need permission + need admin
// TODO - add Categories/SubCategories/Metrics
// Admin Routes
// router.get('/admin', requiresLogin, requiresAdmin, function (req, res) {
//     Course.find({ 'users.name' : req.session.username }, function (err, data) {
//         if (err) {
//             res.sendStatus(500);
//         }
//         res.render('admin', { session: req.session.username, privileges: req.session.privileges, course: data, courses: data });
//     });
// });

// POST - routes
// -------------
router.post('/login', function (req, res) {
    let data;
    if (req.body.email && req.body.password !== undefined) {
        (async () => {
            data = await dbHandler.isEmailInDb(req.body.email);
            // User available in DB
            if (data !== undefined) {
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
                        // TODO - Message: Login Failed
                        res.redirect('/');
                    }
                });
            } else {
                // TODO - Message: Login Failed
                // Message - Login Failed
            }
        })();
    }
});

// TODO - register
// Hash pw before saving
// bcrypt.hash('myPassword', 10, function(err, hash) {
//     // Store hash in database
// });

// need authentication
router.post('/logout', handleSession, function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.post('/dish', upload.single('data'), handleSession, checkUserLogin, function (req, res) {
    let val;
    (async () => {
        val = await dbHandler.createDish(
            req.body.name,
            req.body.duration,
            req.body.shortDescription,
            req.file.filename,
            req.body.description,
            req.session.username,
            req.body.category,
            req.body.subCategory,
            JSON.parse(req.body.ingredients)
        );
        res.send(val);
    })();
});

// TODO - create user
//router.post('/user');

// TODO - credentials change name / email / password / delete user
router.post('/user/:id', handleSession, checkUserLogin, checkUserPermissions, function (req, res) {
    let data;
    // change Username
    if (req.body.action === "0") {
        (async () => {
            // TODO - UPDATE STATEMENT HANGS NODEJS
            data = await dbHandler.changeUsername(req.session.userId, req.body.newUsername);
            if(data) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        })();
    }
});


// DELETE - routes
// -------------
router.delete('/dish/:id', handleSession, checkUserLogin, function (req, res) {
    let data;
    // check db for login data
    (async () => {
        data = await dbHandler.deleteDish(req.session.userId, req.params.id);
        if (data) {
            // delete image from filesystem
            fs.unlink('public/uploads/' + data, (err) => {
                console.log(err);
            });
            res.sendStatus(200);
        } else {
            // something went wrong while deleting
            res.sendStatus(500);
        }
    })();
});

module.exports = router;