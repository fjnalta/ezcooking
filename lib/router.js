// personal imports
const dbHandler = require('./dbHandler');
const auth = require('./authMiddleware');
// generic imports
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
// setup express router
const router = express.Router();
// configure upload destination
const upload = multer({dest: 'public/uploads/'});

// Routes
// ===========================================================

// basic routes
router.get('/', auth.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getLatestDishes();
        res.render('index', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/indices', auth.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getIndices();
        res.json(data);
    })();
});

router.get('/user/:id', auth.handleSession, auth.checkUserLogin, (req, res) => {
    let data;
    (async () => {
        data = await dbHandler.getUserInformation(req.params.id);
        res.render('user', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/dish/:id', auth.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDish(req.params.id);
        res.render('dish', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/dish/:id/edit', auth.handleSession, auth.checkUserLogin, auth.checkUserDishPermissions, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDish(req.params.id);
        res.render('edit-dish', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/browse', auth.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getCategoryOverview();
        res.render('browse', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/browse/:category', auth.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getSubCategories(req.params.category);
        res.render('categories', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/browse/:category/sub/:subcategory', auth.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDishesFromSubCategory(req.params.subcategory);
        res.render('sub-categories', {
            session: req.session,
            data: data
        });
    })();
});

// need authentication + need permission
router.get('/dish', auth.handleSession, auth.checkUserLogin, function (req, res) {
    res.render('add-dish', {
        session: req.session
    });
});

router.get('/settings', auth.handleSession, auth.checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getUser(req.session.userId);
        res.render('settings', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/mydishes', auth.handleSession, auth.checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDishes(req.session.userId);
        res.render('myDishes', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/favorites', auth.handleSession, auth.checkUserLogin, function (req, res) {
    let data;
    // TODO - load favorites from db
    res.render('favorites', {
        session: req.session,
        data: data
    });
});

// Load Data
// =========

/**
 * Load Units
 */
router.get('/units', auth.handleSession, auth.checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getUnits();
        await res.json(data);
    })();
});

/**
 * Load ingredients for dish
 */
router.get('/ingredients/:id', auth.handleSession, auth.checkUserLogin, function (req, res) {
    (async () => {
        let data = await dbHandler.getIngredients(req.params.id);
        await res.json(data);
    })();
});

// Load Categories
router.get('/categories', auth.handleSession, auth.checkUserLogin, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getCategoryNames();
        await res.json(data);
    })();
});

// Load SubCategories
router.get('/categories/:id', auth.handleSession, auth.checkUserLogin, function (req, res) {
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
router.post('/register', (req, res) => {
    // Check if passwords match
    if (req.body.password === req.body.password2) {
        (async () => {
            let hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) reject(err);
                    resolve(hash);
                });
            });
            let query = await dbHandler.createUser(req.body.username, req.body.email, hashedPassword);
            if (query) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        })();
    } else {
        res.sendStatus(500);
    }
});

router.post('/login', (req, res) => {
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

// need authentication
router.post('/logout', auth.handleSession, function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.post('/dish', upload.single('data'), auth.handleSession, auth.checkUserLogin, function (req, res) {
    let val;

    // TODO - check if everything was provided
    // Handle if an image was sent
    let filename = null;
    if (req.file) {
        filename = req.file.filename;
    } else {
        filename = 'no_image';
    }

    (async () => {
        val = await dbHandler.createDish(
            req.body.name,
            req.body.duration,
            req.body.shortDescription,
            filename,
            req.body.description,
            req.session.username,
            req.body.category,
            req.body.subCategory,
            JSON.parse(req.body.ingredients)
        );
        res.send(val);
    })();
});

router.post('/dish/:id', upload.single('data'), auth.handleSession, auth.checkUserLogin, function (req, res) {
    // Handle if an image was sent
    let filename = null;
    if (req.file) {
        filename = req.file.filename;
    }

    (async () => {
        // Call dbHandler
        let val = await dbHandler.updateDish(
            req.body.name,
            req.body.duration,
            req.body.shortDescription,
            filename,
            req.body.description,
            req.session.username,
            req.body.category,
            req.body.subCategory,
            JSON.parse(req.body.ingredients),
            req.params.id
        );
        res.send(val);
    })();
});

// ACCOUNT - routes
// ================

/**
 * Handle everything Account specific (Settings page)
 * @param URI = /user/:id
 * @param req.body.action 0 = changeUsername, 1 = changeEmail, 2 = changePassword, 3 = deleteAccount
 */
router.post('/user/:id', auth.handleSession, auth.checkUserLogin, auth.checkUserPermissions, async (req, res) => {
    if (req.body.action === "0") {
        const data = await dbHandler.changeUsername(req.session.userId, req.body.newUsername);
        if (data) {
            req.session.destroy();
            res.redirect('/');
        } else {
            res.sendStatus(500);
        }
    }
    if (req.body.action === "1") {
        const data = await dbHandler.changeEmail(req.session.userId, req.body.newEmail);
        if (data) {
            req.session.destroy();
            res.redirect('/');
        } else {
            res.sendStatus(500);
        }
    }
    if (req.body.action === "2") {
        if (req.body.newPassword === req.body.newPassword2) {
            await bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                (async () => {
                    const data = await dbHandler.changePassword(req.session.userId, hash);
                    if (data) {
                        req.session.destroy();
                    } else {
                        res.sendStatus(500);
                    }
                })();
            });
        } else {
            console.log("Passwords don't match");
        }
    }
    if (req.body.action === "3") {
        const data = await dbHandler.deleteAccount(req.session.userId);
        if (data) {
            req.session.destroy();
            res.redirect('/');
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(500);
    }
});

// DELETE - routes
// ===============

/**
 * Delete dish
 * @param id
 */
router.delete('/dish/:id', auth.handleSession, auth.checkUserLogin, auth.checkUserDishPermissions, (req, res) => {
    (async () => {
        let data = await dbHandler.deleteDish(req.session.userId, req.params.id);
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